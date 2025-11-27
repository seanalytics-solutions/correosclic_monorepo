import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import {
  ComplaintStatus,
  ComplaintType,
  ComplaintPriority,
} from './entities/complaint.entity';

@ApiTags('Complaints')
@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva queja' })
  @ApiResponse({ status: 201, description: 'Queja creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createComplaintDto: CreateComplaintDto) {
    return this.complaintsService.create(createComplaintDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las quejas' })
  @ApiResponse({ status: 200, description: 'Lista de todas las quejas' })
  findAll() {
    return this.complaintsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar quejas con filtros' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ComplaintStatus,
    description: 'Filtrar por estado',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ComplaintType,
    description: 'Filtrar por tipo',
  })
  @ApiQuery({
    name: 'priority',
    required: false,
    enum: ComplaintPriority,
    description: 'Filtrar por prioridad',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Fecha inicio (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Fecha fin (YYYY-MM-DD)',
  })
  @ApiResponse({ status: 200, description: 'Quejas filtradas' })
  search(
    @Query('status') status?: ComplaintStatus,
    @Query('type') type?: ComplaintType,
    @Query('priority') priority?: ComplaintPriority,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.complaintsService.search({
      status,
      type,
      priority,
      startDate,
      endDate,
    });
  }

  @Get('profile/:profileId')
  @ApiOperation({ summary: 'Obtener quejas por perfil de usuario' })
  @ApiParam({ name: 'profileId', type: Number, description: 'ID del perfil' })
  @ApiResponse({ status: 200, description: 'Quejas del usuario' })
  findByProfile(@Param('profileId', ParseIntPipe) profileId: number) {
    return this.complaintsService.findByProfile(profileId);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Obtener quejas por pedido' })
  @ApiParam({ name: 'orderId', type: Number, description: 'ID del pedido' })
  @ApiResponse({ status: 200, description: 'Quejas del pedido' })
  findByOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.complaintsService.findByOrder(orderId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Obtener quejas por estado' })
  @ApiParam({
    name: 'status',
    enum: ComplaintStatus,
    description: 'Estado de la queja',
  })
  @ApiResponse({ status: 200, description: 'Quejas filtradas por estado' })
  findByStatus(@Param('status') status: ComplaintStatus) {
    return this.complaintsService.findByStatus(status);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Obtener quejas por tipo' })
  @ApiParam({ name: 'type', enum: ComplaintType, description: 'Tipo de queja' })
  @ApiResponse({ status: 200, description: 'Quejas filtradas por tipo' })
  findByType(@Param('type') type: ComplaintType) {
    return this.complaintsService.findByType(type);
  }

  @Get('priority/:priority')
  @ApiOperation({ summary: 'Obtener quejas por prioridad' })
  @ApiParam({
    name: 'priority',
    enum: ComplaintPriority,
    description: 'Prioridad de la queja',
  })
  @ApiResponse({ status: 200, description: 'Quejas filtradas por prioridad' })
  findByPriority(@Param('priority') priority: ComplaintPriority) {
    return this.complaintsService.findByPriority(priority);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de quejas' })
  @ApiResponse({ status: 200, description: 'Estadísticas generales de quejas' })
  getStats() {
    return this.complaintsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una queja por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la queja' })
  @ApiResponse({ status: 200, description: 'Queja encontrada' })
  @ApiResponse({ status: 404, description: 'Queja no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.complaintsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una queja' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la queja' })
  @ApiResponse({ status: 200, description: 'Queja actualizada' })
  @ApiResponse({ status: 404, description: 'Queja no encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateComplaintDto: UpdateComplaintDto,
  ) {
    return this.complaintsService.update(id, updateComplaintDto);
  }

  @Patch(':id/resolve')
  @ApiOperation({ summary: 'Resolver una queja' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la queja' })
  @ApiResponse({ status: 200, description: 'Queja resuelta' })
  resolve(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateComplaintDto: UpdateComplaintDto,
  ) {
    return this.complaintsService.resolve(id, updateComplaintDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una queja' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la queja' })
  @ApiResponse({ status: 200, description: 'Queja eliminada' })
  @ApiResponse({ status: 404, description: 'Queja no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.complaintsService.remove(id);
  }
}
