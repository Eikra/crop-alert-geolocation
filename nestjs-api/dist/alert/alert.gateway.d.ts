import { Server } from 'socket.io';
import { Alert } from '../../generated/prisma';
export declare class AlertGateway {
    server: Server;
    broadcastNewAlert(alert: Alert): void;
}
