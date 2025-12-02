import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { FacturasService, FacturaFilters } from './facturas.service';
import { Factura } from './factura.entity';

@ApiTags('Facturas')
@Controller('facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las facturas o filtrar por query params',
  })
  @ApiQuery({ name: 'id', required: false, type: Number })
  @ApiQuery({ name: 'profileId', required: false, type: Number })
  @ApiQuery({ name: 'numero_factura', required: false, type: String })
  @ApiQuery({ name: 'precio', required: false, type: Number })
  @ApiQuery({ name: 'precioMin', required: false, type: Number })
  @ApiQuery({ name: 'precioMax', required: false, type: Number })
  @ApiQuery({ name: 'sucursal', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'fecha_creacionDesde', required: false, type: String })
  @ApiQuery({ name: 'fecha_creacionHasta', required: false, type: String })
  @ApiQuery({ name: 'fecha_vencimientoDesde', required: false, type: String })
  @ApiQuery({ name: 'fecha_vencimientoHasta', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Lista de facturas',
    type: [Factura],
  })
  findAll(@Query() query: Record<string, string>) {
    // Si no hay ningún filtro, devuelve todas
    if (Object.keys(query).length === 0) {
      return this.facturasService.findAll();
    }

    // Construye los filtros solo con los que vengan
    const filters: FacturaFilters = {};

    if (query.id) filters.id = +query.id;
    if (query.profileId) filters.profileId = +query.profileId;
    if (query.numero_factura) filters.numero_factura = query.numero_factura;
    if (query.precio) filters.precio = +query.precio;
    if (query.precioMin) filters.precioMin = +query.precioMin;
    if (query.precioMax) filters.precioMax = +query.precioMax;
    if (query.sucursal) filters.sucursal = query.sucursal;
    if (query.status) filters.status = query.status;
    if (query.fecha_creacionDesde)
      filters.fecha_creacionDesde = new Date(query.fecha_creacionDesde);
    if (query.fecha_creacionHasta)
      filters.fecha_creacionHasta = new Date(query.fecha_creacionHasta);
    if (query.fecha_vencimientoDesde)
      filters.fecha_vencimientoDesde = new Date(query.fecha_vencimientoDesde);
    if (query.fecha_vencimientoHasta)
      filters.fecha_vencimientoHasta = new Date(query.fecha_vencimientoHasta);

    return this.facturasService.findByFilters(filters);
  }

  @Get('profile/:profileId')
  @ApiOperation({ summary: 'Obtener facturas de un perfil específico' })
  @ApiParam({ name: 'profileId', description: 'ID del perfil', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Facturas encontradas',
    type: [Factura],
  })
  findByProfile(@Param('profileId') profileId: string) {
    return this.facturasService.findByProfile(Number(profileId));
  }

  @Get(':billingId')
  @ApiOperation({ summary: 'Obtener una factura por su ID' })
  @ApiParam({
    name: 'billingId',
    description: 'ID de la factura',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Factura encontrada',
    type: Factura,
  })
  findByBillingId(@Param('billingId') billingId: string) {
    return this.facturasService.findByBillingId(Number(billingId));
  }
}
