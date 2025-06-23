import { IsNumber, IsArray, IsOptional, ArrayNotEmpty, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class NearbyAlertsDto {
  @Type(() => Number)
  @IsNumber()
  lat: number;

  @Type(() => Number)
  @IsNumber()
  lng: number;

  @Type(() => Number)
  @IsNumber()
  radius: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(c => c.trim());
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  crops?: string[];

  // @IsOptional()
  // @IsArray()
  // @ArrayNotEmpty()
  // @Type(() => String)
  // @IsString({ each: true })
  // crops?: string[];
}
