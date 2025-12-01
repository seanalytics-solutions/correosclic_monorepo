// apps/backend/src/carrito/carrito.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CarritoService {
  constructor(private prisma: PrismaService) {}

  async obtenerCarrito(profileId: number) {
    const productos = await this.prisma.carrito.findMany({
      where: { profileId, activo: true },
      include: {
        producto: {
          include: {
            images: true,
          },
        },
      },
    });

    if (!productos.length) {
      throw new NotFoundException(
        'El usuario no tiene productos en el carrito',
      );
    }

    return productos;
  }

  async agregarProducto(
    profileId: number,
    productId: number,
    cantidad: number,
  ) {
    const usuario = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });
    const producto = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!usuario || !producto) {
      throw new NotFoundException('Usuario o producto no encontrado');
    }

    const existente = await this.prisma.carrito.findFirst({
      where: {
        profileId,
        productoId: productId,
      },
    });

    if (existente) {
      return this.prisma.carrito.update({
        where: { id: existente.id },
        data: { cantidad: existente.cantidad + cantidad },
      });
    }

    return this.prisma.carrito.create({
      data: {
        profileId,
        productoId: productId,
        cantidad,
        precio_unitario: producto.precio,
        activo: true,
      },
    });
  }

  async editarCantidad(id: number, nuevaCantidad: number) {
    if (nuevaCantidad < 1) {
      throw new BadRequestException('La cantidad mínima debe ser 1');
    }

    const item = await this.prisma.carrito.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException('Producto en carrito no encontrado');
    }

    return this.prisma.carrito.update({
      where: { id },
      data: { cantidad: nuevaCantidad },
    });
  }

  async eliminarDelCarrito(id: number) {
    const item = await this.prisma.carrito.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException('Producto en carrito no encontrado');
    }

    return this.prisma.carrito.delete({ where: { id } });
  }

  async subtotal(profileId: number) {
    const productos = await this.prisma.carrito.findMany({
      where: { profileId, activo: true },
    });

    const subtotal = productos.reduce((acc, item) => {
      return acc + item.cantidad * Number(item.precio_unitario);
    }, 0);

    return { subtotal };
  }

  async procederAlPago(profileId: number) {
    const productos = await this.obtenerCarrito(profileId);
    if (!productos.length) throw new NotFoundException('El carrito está vacío');

    return {
      message: 'Redirigiendo a detalles de compra...',
      productos,
    };
  }
}
