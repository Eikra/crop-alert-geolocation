import { PrismaService } from '../prisma/prisma.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { EditAlertDto } from './dto/edit-alert.dto';
import { NearbyAlertsDto } from './dto/nearby-alerts.dto';
import { AlertGateway } from './alert.gateway';
import { Cache } from 'cache-manager';
import { RedisClientType } from 'redis';
export declare class AlertService {
    private prisma;
    private alertGateway;
    private cacheManager;
    private redisClient;
    constructor(prisma: PrismaService, alertGateway: AlertGateway, cacheManager: Cache, redisClient: RedisClientType<any>);
    createAlert(userId: number, dto: CreateAlertDto): Promise<{
        id: number;
        createdAt: Date;
        title: string;
        description: string;
        crops: string[];
        severity: import("generated/prisma").$Enums.Severity;
        latitude: number;
        longitude: number;
        creatorId: number;
    }>;
    getAlerts(userId: number): Promise<{
        id: number;
        createdAt: Date;
        title: string;
        description: string;
        crops: string[];
        severity: import("generated/prisma").$Enums.Severity;
        latitude: number;
        longitude: number;
        creatorId: number;
    }[]>;
    getAlertById(userId: number, alertId: number): Promise<{
        id: number;
        createdAt: Date;
        title: string;
        description: string;
        crops: string[];
        severity: import("generated/prisma").$Enums.Severity;
        latitude: number;
        longitude: number;
        creatorId: number;
    } | null>;
    editAlertById(userId: number, alertId: number, dto: EditAlertDto): Promise<{
        id: number;
        createdAt: Date;
        title: string;
        description: string;
        crops: string[];
        severity: import("generated/prisma").$Enums.Severity;
        latitude: number;
        longitude: number;
        creatorId: number;
    }>;
    deleteAlertById(userId: number, alertId: number): Promise<{
        id: number;
        createdAt: Date;
        title: string;
        description: string;
        crops: string[];
        severity: import("generated/prisma").$Enums.Severity;
        latitude: number;
        longitude: number;
        creatorId: number;
    }>;
    findNearby(dto: NearbyAlertsDto): Promise<unknown>;
    private buildNearbyCacheKey;
    private invalidateNearbyCache;
}
