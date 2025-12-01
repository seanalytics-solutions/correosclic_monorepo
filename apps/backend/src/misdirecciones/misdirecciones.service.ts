import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMisdireccioneDto } from './dto/create-misdireccione.dto';
import { UpdateMisdireccioneDto } from './dto/update-misdireccione.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MisdireccionesService {
  constructor(private prisma: PrismaService) {}

  async obtenerPorUsuario(usuarioId: number) {
    return this.prisma.misdireccione.findMany({
      where: { usuarioId: usuarioId },
      include: { usuario: true },
    });
  }

  async findOne(id: number) {
    const direccion = await this.prisma.misdireccione.findUnique({
      where: { id },
    });

    if (!direccion) {
      throw new NotFoundException(`Dirección con id ${id} no encontrada`);
    }

    return direccion;
  }

  async create(createDto: CreateMisdireccioneDto) {
    return this.prisma.misdireccione.create({
      data: {
        nombre: createDto.nombre,
        calle: createDto.calle,
        colonia_fraccionamiento: createDto.colonia_fraccionamiento,
        numero_interior: createDto.numero_interior,
        numero_exterior: createDto.numero_exterior,
        numero_celular: createDto.numero_celular,
        codigo_postal: createDto.codigo_postal,
        estado: createDto.estado,
        municipio: createDto.municipio,
        mas_info: createDto.mas_info,
        usuario: { connect: { id: createDto.usuarioId } },
      },
    });
  }

  findAll() {
    return `This action returns all misdirecciones`;
  }

  async update(id: number, dto: UpdateMisdireccioneDto) {
    const direccion = await this.prisma.misdireccione.findUnique({
      where: { id },
    });
    if (!direccion) {
      throw new NotFoundException(`Dirección con id ${id} no encontrada`);
    }

    return this.prisma.misdireccione.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    const direccion = await this.prisma.misdireccione.findUnique({
      where: { id },
    });
    if (!direccion) {
      throw new NotFoundException(`Dirección con id ${id} no encontrada`);
    }
    await this.prisma.misdireccione.delete({
      where: { id },
    });
  }
}
