import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '../../generated/prisma';
export declare class PrismaService extends PrismaClient {
    private configService;
    constructor(configService: ConfigService);
    cleanDb(): Promise<[import("../../generated/prisma").Prisma.BatchPayload, import("../../generated/prisma").Prisma.BatchPayload]>;
}
