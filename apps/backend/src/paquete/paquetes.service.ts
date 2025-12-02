import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Paquete } from './entities/paquete.entity';

@Injectable()
export class PaquetesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.paquete.findMany();
  }

  async findOne(id: number): Promise<Paquete> {
    const paquete = await this.prisma.paquete.findUnique({ where: { id } });
    if (!paquete) {
      throw new NotFoundException(`Paquete con ID ${id} no encontrado`);
    }
    return paquete as any; // Cast to match return type if needed
  }

  create(data: any) {
    return this.prisma.paquete.create({ data });
  }

  async update(id: number, data: any): Promise<Paquete> {
    return (await this.prisma.paquete.update({
      where: { id },
      data,
    })) as any;
  }

  async actualizarEstatus(
    id: number,
    nuevoEstatus: string,
  ): Promise<Paquete | null> {
    try {
      return (await this.prisma.paquete.update({
        where: { id },
        data: { estatus: nuevoEstatus },
      })) as any;
    } catch (e) {
      return null;
    }
  }

  async anadirEvidencia(
    id: number,
    urlEvidencia: string,
  ): Promise<Paquete | null> {
    try {
      return (await this.prisma.paquete.update({
        where: { id },
        data: { evidencia: urlEvidencia },
      })) as any;
    } catch (e) {
      return null;
    }
  }

  remove(id: number) {
    return this.prisma.paquete.delete({ where: { id } });
  }
}
