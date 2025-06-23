import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
// import { ToDoModule } from './todo/todo.module';
import { PrismaModule } from './prisma/prisma.module';
import { AlertModule } from './alert/alert.module';
import { RateLimiterModule } from 'nestjs-rate-limiter';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    RedisModule, // Custom Redis module for global Redis client
    RateLimiterModule.register({
      points: 100,       // 100 requests
      duration: 60,      // per 60 seconds (1 minute)
      keyPrefix: 'global',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST') ,
            port: configService.get<number>('REDIS_PORT') ,
          },
          ttl: 60, // default cache time (seconds)
        }),
      }),
    }),
    AuthModule,
    UserModule,
    // ToDoModule,
    AlertModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
