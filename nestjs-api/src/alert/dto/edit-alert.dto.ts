import { IsArray, IsOptional, IsString, IsEnum } from 'class-validator';
import { Severity } from '../../../generated/prisma';

export class EditAlertDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  crops?: string[];

  @IsOptional()
  @IsEnum(Severity)
  severity?: Severity;
}
