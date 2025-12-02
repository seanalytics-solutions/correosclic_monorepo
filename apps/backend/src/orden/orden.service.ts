import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdenDetalleDto } from './dto/orden-detalle.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdenService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerDetalleOrden(id: number): Promise<OrdenDetalleDto> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        profile: true,
        contenidos: {
          include: {
            producto: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException(`No se encontró la transacción con id ${id}`);
    }

    const profile = transaction.profile;

    const productos = transaction.contenidos.map((tc) => ({
      nombre: tc.producto?.nombre || 'Producto desconocido',
      precio: Number(tc.precio),
      cantidad: tc.cantidad,
    }));

    return {
      id: transaction.id,
      total: transaction.total.toString(),
      fecha: transaction.diaTransaccion,
      usuario: {
        nombre: profile.nombre,
      },
      direccion: {
        estado: profile.estado,
        ciudad: profile.ciudad,
        codigoPostal: profile.codigoPostal,
        colonia: profile.fraccionamiento,
      },
      productos,
    };
  }
}
