import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOficinaDto } from './dto/create-oficina.dto';
import { UpdateOficinaDto } from './dto/update-oficina.dto';
import { AgregarClaveZonaDto } from './dto/agregar-clave-zona.dto';
import { EliminarClaveZonaDto } from './dto/eliminar-clave-zona.dto';

@Injectable()
export class OficinasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOficinaDto) {
    if (dto.clave_oficina_postal !== null) {
      const existe = await this.prisma.oficina.findFirst({
        where: { clave_oficina_postal: dto.clave_oficina_postal.toString() },
      });
      if (existe) {
        throw new BadRequestException(
          `Ya existe una oficina con la clave ${dto.clave_oficina_postal}`,
        );
      }
    }

    return this.prisma.oficina.create({
      data: dto,
    });
  }

  active() {
    return this.prisma.oficina.findMany({
      where: { activo: true },
    });
  }

  inactive() {
    return this.prisma.oficina.findMany({
      where: { activo: false },
    });
  }

  findAll() {
    return this.prisma.oficina.findMany();
  }

  findClave(clave_oficina_postal: string) {
    return this.prisma.oficina.findFirst({
      where: {
        clave_oficina_postal: clave_oficina_postal,
        activo: true,
      },
    });
  }

  async findOne(id: number) {
    const oficina = await this.prisma.oficina.findUnique({
      where: { id_oficina: id },
    });
    if (!oficina) throw new NotFoundException('Oficina no encontrada');
    return oficina;
  }

  findClaveUnicaZona(clave_oficina_postal: string) {
    return this.prisma.oficina.findMany({
      where: { clave_oficina_postal: clave_oficina_postal },
      select: { clave_unica_zona: true },
    });
  }

  async update(id: number, data: UpdateOficinaDto) {
    const oficina = await this.findOne(id);
    return this.prisma.oficina.update({
      where: { id_oficina: id },
      data,
    });
  }

  async deactivate(id: number) {
    const oficina = await this.prisma.oficina.findUnique({
      where: { id_oficina: id },
    });

    if (!oficina) {
      throw new NotFoundException(`La oficina con id ${id} no existe.`);
    }

    await this.prisma.oficina.update({
      where: { id_oficina: id },
      data: { activo: false },
    });
    return { message: 'Oficina desactivada correctamente' };
  }

  async activate(id: number) {
    const oficina = await this.prisma.oficina.findUnique({
      where: { id_oficina: id },
    });

    if (!oficina) {
      throw new NotFoundException(`La oficina con id ${id} no existe.`);
    }

    await this.prisma.oficina.update({
      where: { id_oficina: id },
      data: { activo: true },
    });
    return { message: 'Oficina activada correctamente' };
  }

  async agregarClaveZona(cuo: string, dto: AgregarClaveZonaDto) {
    const oficina = await this.prisma.oficina.findUnique({
      where: { clave_cuo: cuo },
    });
    if (!oficina) throw new NotFoundException('Oficina no encontrada');

    if (dto.claveZona === cuo) {
      throw new BadRequestException(
        'No puedes asignar la misma clave CUO como clave de zona',
      );
    }

    const clavesActuales = oficina.clave_unica_zona
      ? oficina.clave_unica_zona.split(',')
      : [];

    if (clavesActuales.includes(dto.claveZona)) {
      throw new BadRequestException('La clave ya existe en esta oficina');
    }

    clavesActuales.push(dto.claveZona);
    const nuevaClaveUnicaZona = clavesActuales.join(',');

    return this.prisma.oficina.update({
      where: { clave_cuo: cuo },
      data: { clave_unica_zona: nuevaClaveUnicaZona },
    });
  }

  async eliminarClaveZona(cuo: string, dto: EliminarClaveZonaDto) {
    const oficina = await this.prisma.oficina.findUnique({
      where: { clave_cuo: cuo },
    });
    if (!oficina) throw new NotFoundException('Oficina no encontrada');

    const clavesActuales = oficina.clave_unica_zona
      ? oficina.clave_unica_zona.split(',')
      : [];
    const nuevasClaves = clavesActuales.filter((c) => c !== dto.claveZona);

    if (clavesActuales.length === nuevasClaves.length) {
      throw new BadRequestException('La clave no existe en esta oficina');
    }

    const nuevaClaveUnicaZona =
      nuevasClaves.length > 0 ? nuevasClaves.join(',') : '';

    return this.prisma.oficina.update({
      where: { clave_cuo: cuo },
      data: { clave_unica_zona: nuevaClaveUnicaZona },
    });
  }
}
