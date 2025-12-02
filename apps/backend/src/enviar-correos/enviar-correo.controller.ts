import { Controller, Post, Body } from '@nestjs/common';
import { EnviarCorreosService } from './enviar-correos.service';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

class EnviarBienvenidaVendedorDto {
  @ApiProperty({
    example: 'vendedor@email.com',
    description: 'Correo del vendedor',
  })
  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del vendedor' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    example: 'Abarrotes Don Pepe',
    description: 'Nombre de la tienda',
  })
  @IsString()
  @IsNotEmpty()
  nombreTienda: string;
}

@ApiTags('Correos')
@Controller('correos')
export class EnviarCorreosController {
  constructor(private readonly enviarCorreosService: EnviarCorreosService) {}

  @Post('bienvenida-vendedor')
  @ApiOperation({ summary: 'Enviar email de bienvenida a vendedor' })
  @ApiBody({ type: EnviarBienvenidaVendedorDto })
  @ApiResponse({ status: 201, description: 'Email enviado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async enviarBienvenidaVendedor(@Body() dto: EnviarBienvenidaVendedorDto) {
    await this.enviarCorreosService.enviarBienvenidaVendedor(dto);
    return { message: 'Email de bienvenida enviado correctamente' };
  }
}
