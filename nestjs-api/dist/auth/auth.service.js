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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon = require("argon2");
const library_1 = require("@prisma/client/runtime/library");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    prisma;
    jwt;
    config;
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async signup(dto) {
        const hashedPassword = await argon.hash(dto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hashedPassword,
                    role: dto.role,
                },
            });
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError || error.name === 'PrismaClientKnownRequestError') {
                if (error.code === 'P2002') {
                    throw new common_1.ForbiddenException('Email already in use');
                }
            }
            else if (error instanceof library_1.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new common_1.ForbiddenException('User not found');
            }
            else {
                console.error('Unexpected error during signup:', error);
                throw new common_1.ForbiddenException('Registration failed');
            }
        }
    }
    async signin(dto) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: dto.email,
                },
            });
            if (!user) {
                throw new common_1.ForbiddenException('Credentials incorrect');
            }
            const passwordMatches = await argon.verify(user.password, dto.password);
            if (!passwordMatches) {
                throw new common_1.ForbiddenException('Credentials incorrect');
            }
            const { password, ...userWithoutPassword } = user;
            return this.signToken(user.id, user.email, user.role);
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.ForbiddenException('Credentials incorrect');
                }
            }
            console.error('Unexpected error during signin:', error);
            throw error;
        }
    }
    async signToken(userId, email, role) {
        const payload = { sub: userId, email, role };
        const secret = this.config.get('JWT_SECRET');
        const refreshSecret = this.config.get('JWT_REFRESH_SECRET');
        const access_token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret,
        });
        const refresh_token = await this.jwt.signAsync(payload, {
            expiresIn: '7d',
            secret: refreshSecret,
        });
        return { access_token, refresh_token };
    }
    async refresh(body) {
        try {
            const payload = await this.jwt.verifyAsync(body.refresh_token, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
            });
            const newAccessToken = await this.jwt.signAsync({ sub: payload.sub, email: payload.email, role: payload.role }, {
                expiresIn: '15m',
                secret: this.config.get('JWT_SECRET'),
            });
            return { access_token: newAccessToken };
        }
        catch (error) {
            throw new common_1.ForbiddenException('Invalid refresh token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map