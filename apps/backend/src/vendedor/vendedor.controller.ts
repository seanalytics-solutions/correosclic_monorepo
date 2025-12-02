import { Controller, Get, Param, Post, ParseIntPipe } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { VendedorService } from './vendedor.service';
import { SolicitudDto } from './dto/solicitud.dto';
import { PedidosAsignadosResponseDto } from './dto/pedidos-asignados.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Vendedor')
@Controller('vendedor')
export class VendedorController {
  constructor(private readonly vendedorService: VendedorService) {}

  @Post('crear-solicitud')
  @ApiOperation({ summary: 'Crear solicitud de vendedor' })
  @ApiResponse({
    status: 201,
    description: 'Solicitud creada exitosamente',
  })
  async crearSolicitud(@Body() solicitud: SolicitudDto) {
    console.log('🎯 Solicitud recibida en controller:', solicitud);
    return this.vendedorService.crearSolicitud(solicitud);
  }

  @Get('encontrar-solicitud/:userId')
  @ApiOperation({ summary: 'Encontrar solicitud por ID de usuario' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Solicitud encontrada',
  })
  async encontrarPorUserId(@Param('userId') userId: string) {
    return this.vendedorService.encontrarPorUserId(userId);
  }

  @Get('pedidos-asignados/:profileId')
  @ApiOperation({ summary: 'Obtener pedidos asignados al vendedor' })
  @ApiParam({ name: 'profileId', description: 'ID del perfil del vendedor' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos asignados al vendedor',
    type: PedidosAsignadosResponseDto,
  })
  async obtenerPedidosAsignados(
    @Param('profileId', ParseIntPipe) profileId: number,
  ): Promise<PedidosAsignadosResponseDto> {
    console.log('🎯 Obteniendo pedidos asignados para profileId:', profileId);

    const pedidos =
      await this.vendedorService.obtenerPedidosAsignados(profileId);

    return {
      data: pedidos,
      total: pedidos.length,
      status: 'ok',
    };
  }
}
