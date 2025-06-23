import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AlertGateway } from './alert.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [AlertController],
  providers: [AlertService, AlertGateway],
  exports: [AlertService],
})
export class AlertModule {}