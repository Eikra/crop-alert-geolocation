import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, ArrayNotEmpty, Length } from 'class-validator';
import { Severity } from '../../../generated/prisma';

export class CreateAlertDto {
  
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty()
  @Type(() => Number) // Ensure location is treated as an array of numbers
  location: [number, number]; // [longitude, latitude]
  
  @IsNotEmpty()
  @IsString({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  crops: string[];


 @IsEnum(Severity)
  @IsOptional()
  severity?: Severity;
}
