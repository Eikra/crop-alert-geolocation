import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { NearbyAlertsDto } from './dto/nearby-alerts.dto';
import { EditAlertDto } from './dto/edit-alert.dto';
export declare class AlertController {
    private alertService;
    constructor(alertService: AlertService);
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
}
