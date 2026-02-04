import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ShippingZone } from '../schemas/city.schema';

export class CreateCityDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  department: string;

  @IsNotEmpty()
  @IsEnum(ShippingZone)
  zone: ShippingZone;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
