import { ForbiddenException, Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { EditAlertDto } from './dto/edit-alert.dto';
import { NearbyAlertsDto } from './dto/nearby-alerts.dto';
import { AlertGateway } from './alert.gateway';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisClientType } from 'redis';

@Injectable()
export class AlertService {
  constructor(
    private prisma: PrismaService,
    private alertGateway: AlertGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('REDIS_CLIENT') private redisClient: RedisClientType<any>
  ) {}

  async createAlert(userId: number, dto: CreateAlertDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'AGRONOMIST') {
      throw new ForbiddenException('Only Agronomists can create alerts.');
    }

    const alert = await this.prisma.alert.create({
      data: {
        title: dto.title,
        description: dto.description,
        crops: dto.crops,
        severity: dto.severity ?? "MEDIUM",
        latitude: dto.location[1],
        longitude: dto.location[0],
        creatorId: userId,
      },
    });

    await this.invalidateNearbyCache();
    this.alertGateway.broadcastNewAlert(alert);
    return alert;
  }

  async getAlerts(userId: number) {
    return this.prisma.alert.findMany({ where: { creatorId: userId } });
  }

  async getAlertById(userId: number, alertId: number) {
    return this.prisma.alert.findFirst({
      where: { id: alertId, creatorId: userId },
    });
  }

  async editAlertById(userId: number, alertId: number, dto: EditAlertDto) {
    const alert = await this.prisma.alert.findUnique({ where: { id: alertId } });

    if (!alert || alert.creatorId !== userId)
      throw new ForbiddenException('Access denied');

    const updated = await this.prisma.alert.update({
      where: { id: alertId },
      data: { ...dto },
    });

    await this.invalidateNearbyCache();
    return updated;
  }

  async deleteAlertById(userId: number, alertId: number) {
    const alert = await this.prisma.alert.findUnique({ where: { id: alertId } });

    if (!alert || alert.creatorId !== userId)
      throw new ForbiddenException('Access denied');

    const deleted = await this.prisma.alert.delete({ where: { id: alertId } });

    await this.invalidateNearbyCache();
    return deleted;
  }

  async findNearby(dto: NearbyAlertsDto) {
    const { lat, lng, radius, crops } = dto;

    if (radius <= 0) {
      throw new ForbiddenException('Radius must be greater than zero');
    }

    const cacheKey = await this.buildNearbyCacheKey(lat, lng, radius, crops);

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    const query = `
      SELECT *
      FROM alerts
      WHERE (
        6371 * acos(
          cos(radians($1))
          * cos(radians(latitude))
          * cos(radians(longitude) - radians($2))
          + sin(radians($1))
          * sin(radians(latitude))
        )
      ) <= $3
      ${crops?.length ? 'AND crops && $4::text[]' : ''}
    `;

    const params = crops?.length ? [lat, lng, radius, crops] : [lat, lng, radius];
    const result = await this.prisma.$queryRawUnsafe(query, ...params);

    await this.cacheManager.set(cacheKey, result, 60);
    return result;
  }

  private async buildNearbyCacheKey(lat: number, lng: number, radius: number, crops?: string[]): Promise<string> {
    const version = await this.redisClient.get('nearby:version') || '1';
    return `nearby:v${version}:${lat}:${lng}:${radius}:${(crops ?? []).join(',')}`;
  }

  private async invalidateNearbyCache() {
    await this.redisClient.incr('nearby:version');
  }
}
