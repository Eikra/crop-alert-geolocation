import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { NearbyAlertsDto } from './dto/nearby-alerts.dto';
import { EditAlertDto } from './dto/edit-alert.dto';

@UseGuards(JwtGuard)
@Controller('alerts')
export class AlertController {
  constructor(private alertService: AlertService) {}

  @Get()
  getAlerts(@GetUser('id') userId: number) {
    return this.alertService.getAlerts(userId);
  }

  @Get(':id')
  getAlertById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) alertId: number,
  ) {
    return this.alertService.getAlertById(userId, alertId);
  }

  @Post()
  createAlert(
    @GetUser('id') userId: number,
    @Body() dto: CreateAlertDto,
  ) {
    console.log('Creating alert with data:', dto);
    return this.alertService.createAlert(userId, dto);
  }

  @Patch(':id')
  editAlertById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) alertId: number,
    @Body() dto: EditAlertDto,
  ) {
    return this.alertService.editAlertById(userId, alertId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteAlertById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) alertId: number,
  ) {
    return this.alertService.deleteAlertById(userId, alertId);
  }

  @Get('nearby/search')
  findNearby(@Query() dto: NearbyAlertsDto) {
    return this.alertService.findNearby(dto);
  }
}
