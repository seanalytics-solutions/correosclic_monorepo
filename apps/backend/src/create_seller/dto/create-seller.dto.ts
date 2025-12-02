import {
  IsInt,
  IsString,
  IsNumber,
  IsDateString,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSellerDto {
  @IsString()
  @ApiProperty({
    example: 'Daniel Robles',
  })
  name: string;

  @IsString()
  @ApiProperty({
    example: 'RODA021117G73',
  })
  RFC: string;

  @IsEmail()
  @ApiProperty({
    example: 'Calle Hidalgo 237, Zona Centro, Durango, Dgo',
  })
  address: string;

  @IsString()
  @ApiProperty({
    example: '5569071265',
  })
  phone: string;

  @IsString()
  @ApiProperty({
    example: 'daniel_robles@email.com',
  })
  email: string;

  @IsString()
  password: string;

  @IsString()
  @ApiProperty({
    example: 'daniel_robles01',
  })
  user: string;
}
