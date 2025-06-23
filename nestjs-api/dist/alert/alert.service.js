"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const alert_gateway_1 = require("./alert.gateway");
const cache_manager_1 = require("@nestjs/cache-manager");
let AlertService = class AlertService {
    prisma;
    alertGateway;
    cacheManager;
    redisClient;
    constructor(prisma, alertGateway, cacheManager, redisClient) {
        this.prisma = prisma;
        this.alertGateway = alertGateway;
        this.cacheManager = cacheManager;
        this.redisClient = redisClient;
    }
    async createAlert(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.role !== 'AGRONOMIST') {
            throw new common_1.ForbiddenException('Only Agronomists can create alerts.');
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
    async getAlerts(userId) {
        return this.prisma.alert.findMany({ where: { creatorId: userId } });
    }
    async getAlertById(userId, alertId) {
        return this.prisma.alert.findFirst({
            where: { id: alertId, creatorId: userId },
        });
    }
    async editAlertById(userId, alertId, dto) {
        const alert = await this.prisma.alert.findUnique({ where: { id: alertId } });
        if (!alert || alert.creatorId !== userId)
            throw new common_1.ForbiddenException('Access denied');
        const updated = await this.prisma.alert.update({
            where: { id: alertId },
            data: { ...dto },
        });
        await this.invalidateNearbyCache();
        return updated;
    }
    async deleteAlertById(userId, alertId) {
        const alert = await this.prisma.alert.findUnique({ where: { id: alertId } });
        if (!alert || alert.creatorId !== userId)
            throw new common_1.ForbiddenException('Access denied');
        const deleted = await this.prisma.alert.delete({ where: { id: alertId } });
        await this.invalidateNearbyCache();
        return deleted;
    }
    async findNearby(dto) {
        const { lat, lng, radius, crops } = dto;
        console.log('Finding nearby alerts with params:', dto);
        if (radius <= 0) {
            throw new common_1.ForbiddenException('Radius must be greater than zero');
        }
        const cacheKey = await this.buildNearbyCacheKey(lat, lng, radius, crops);
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            console.log('✅ Returning cached nearby alerts');
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
    async buildNearbyCacheKey(lat, lng, radius, crops) {
        const version = await this.redisClient.get('nearby:version') || '1';
        return `nearby:v${version}:${lat}:${lng}:${radius}:${(crops ?? []).join(',')}`;
    }
    async invalidateNearbyCache() {
        console.log('🚀 Cache version bumped');
        await this.redisClient.incr('nearby:version');
    }
};
exports.AlertService = AlertService;
exports.AlertService = AlertService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __param(3, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        alert_gateway_1.AlertGateway, Object, Object])
], AlertService);
//# sourceMappingURL=alert.service.js.map