import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritosService {
  constructor(private prisma: PrismaService) {}

  async findByUsuario(profileId: number) {
    const favoritos = await this.prisma.favorito.findMany({
      where: { profileId },
      include: {
        producto: {
          include: {
            images: true,
          },
        },
      },
    });

    if (!favoritos.length) {
      throw new NotFoundException('Usuario no tiene favoritos');
    }

    return favoritos;
  }

  async addFavorito(profileId: number, productId: number) {
    const usuario = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${profileId} no existe`);
    }

    const producto = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!producto) {
      throw new NotFoundException(`Producto con id ${productId} no existe`);
    }

    const yaExiste = await this.prisma.favorito.findFirst({
      where: {
        profileId,
        productoId: productId,
      },
    });

    if (yaExiste) {
      throw new ConflictException('Ya está en favoritos');
    }

    return this.prisma.favorito.create({
      data: {
        profileId,
        productoId: productId,
      },
    });
  }

  async removeFavorito(id: number) {
    const favorito = await this.prisma.favorito.findUnique({ where: { id } });
    if (!favorito) {
      throw new NotFoundException('Favorito no encontrado');
    }
    await this.prisma.favorito.delete({ where: { id } });
    return { message: 'Favorito eliminado correctamente' };
  }

  async addToCarritoDesdeFavorito(profileId: number, productId: number) {
    const usuario = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });
    const producto = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!usuario || !producto) {
      throw new NotFoundException('Usuario o producto no existe');
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
        data: { cantidad: existente.cantidad + 1 },
      });
    }

    return this.prisma.carrito.create({
      data: {
        profileId,
        productoId: productId,
        cantidad: 1,
        precio_unitario: producto.precio,
        activo: true,
      },
    });
  }
}
