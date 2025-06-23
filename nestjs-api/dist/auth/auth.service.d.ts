import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, SigninDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    signup(dto: AuthDto): Promise<{
        email: string;
        role: import("generated/prisma").$Enums.UserRole;
        id: number;
        userId: string;
        firstName: string | null;
        lastName: string | null;
        subscribedCrops: string[];
        createdAt: Date;
        updatedAt: Date;
    } | undefined>;
    signin(dto: SigninDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    signToken(userId: number, email: string, role: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refresh(body: {
        refresh_token: string;
    }): Promise<{
        access_token: string;
    }>;
}
