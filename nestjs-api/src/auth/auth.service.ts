import {
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { AuthDto, SigninDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) { }

  async signup(dto: AuthDto) {
    const hashedPassword = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          role: dto.role, // Assuming role is part of AuthDto

        },
      });

      // remove password before returning
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError || error.name === 'PrismaClientKnownRequestError') {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already in use');
        }
      }
      else if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ForbiddenException('User not found');
      }
      else {
        console.error('Unexpected error during signup:', error);
        throw new ForbiddenException('Registration failed');
        // throw error; // rethrow unexpected errors
      }

    }
  }

  async signin(dto: SigninDto) {

    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      if (!user) {
        throw new ForbiddenException('Credentials incorrect');
      }

      const passwordMatches = await argon.verify(user.password, dto.password);

      if (!passwordMatches) {
        throw new ForbiddenException('Credentials incorrect');
      }

      const { password, ...userWithoutPassword } = user;
      return this.signToken(user.id, user.email, user.role);

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ForbiddenException('Credentials incorrect');
        }
      }
      console.error('Unexpected error during signin:', error);
      throw error; // rethrow unexpected errors
    }

  }

  // signToken() stays same for access token
  async signToken(userId: number, email: string, role: string): Promise<{ access_token: string, refresh_token: string }> {
    const payload = { sub: userId, email, role };
    const secret = this.config.get<string>('JWT_SECRET');
    const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET');

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

  // async refresh(body: { refresh_token: string }) {
  //   const { refresh_token } = body;

  //   if (!refresh_token) {
  //     throw new ForbiddenException('Refresh token is required');
  //   }

  //   try {
  //     const payload = await this.jwt.verifyAsync(refresh_token, {
  //       secret: this.config.get<string>('JWT_REFRESH_SECRET'),
  //     });

  //     return this.signToken(payload.sub, payload.email, payload.role);
  //   } catch (error) {
  //     console.error('Error verifying refresh token:', error);
  //     throw new ForbiddenException('Invalid refresh token');
  //   }
  // }

    async refresh(body: { refresh_token: string }) {
    try {
      const payload = await this.jwt.verifyAsync(body.refresh_token, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });

      const newAccessToken = await this.jwt.signAsync(
        { sub: payload.sub, email: payload.email, role: payload.role },
        {
          expiresIn: '15m',
          secret: this.config.get<string>('JWT_SECRET'),
        }
      );

      return { access_token: newAccessToken };
    } catch (error) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }

}
