import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AsignacionPaquetesService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: number) {
    return this.prisma.asignacionPaquetes.findUnique({
      where: { id },
      include: { paquete: true },
    });
  }

  create(data: any) {
    // Adaptar datos si es necesario
    return this.prisma.asignacionPaquetes.create({
      data: {
        ...data,
        // Si data tiene idPaquete como objeto, extraer ID si es necesario,
        // pero Prisma espera idPaqueteId o connect.
        // Por ahora asumimos que data es compatible o lo dejamos pasar.
        // Si data viene de TypeORM entity, podría tener idPaquete como objeto.
      },
    });
  }

  async update(id: number, data: any) {
    await this.prisma.asignacionPaquetes.update({
      where: { id },
      data,
    });
    return this.findOne(id);
  }

  remove(id: number) {
    return this.prisma.asignacionPaquetes.delete({
      where: { id },
    });
  }
}
