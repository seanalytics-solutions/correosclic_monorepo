import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
// import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  async create(createPedidoDto: CreatePedidoDto) {
    const { profileId, direccionId, productos, ...rest } = createPedidoDto;

    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });
    if (!profile) {
      throw new NotFoundException(`El perfil con ID ${profileId} no existe`);
    }

    const direccion = await this.prisma.misdireccione.findUnique({
      where: { id: direccionId },
    });
    if (!direccion) {
      throw new NotFoundException(
        `La dirección con ID ${direccionId} no existe`,
      );
    }

    let total = 0;
    const pedidoProductosData: { productoId: number; cantidad: number }[] = [];

    for (const item of productos) {
      const producto = await this.prisma.product.findUnique({
        where: { id: item.producto_id },
      });
      if (!producto) {
        throw new NotFoundException(
          `El producto con ID ${item.producto_id} no existe`,
        );
      }

      const subtotal = Number(producto.precio) * item.cantidad;
      total += subtotal;

      pedidoProductosData.push({
        productoId: producto.id,
        cantidad: item.cantidad,
      });
    }

    await this.prisma.pedido.create({
      data: {
        profileId,
        direccionId,
        estatus_pago: rest.estatus_pago ?? '',
        calle: rest.calle ?? '',
        numero_int: rest.numero_int ?? '',
        numero_exterior: rest.numero_exterior ?? '',
        cp: rest.cp ?? '',
        ciudad: rest.ciudad ?? '',
        nombre: rest.nombre ?? '',
        last4: rest.last4 ?? '',
        brand: rest.brand ?? '',
        total,
        status: rest.status,
        productos: {
          create: pedidoProductosData.map((p) => ({
            producto: { connect: { id: p.productoId } },
            cantidad: p.cantidad,
          })),
        },
      },
    });

    return { message: 'Pedido creado correctamente' };
  }

  async findAll() {
    return this.prisma.pedido.findMany({
      include: {
        productos: {
          include: {
            producto: {
              include: {
                images: true,
              },
            },
          },
        },
        direccion: true,
        factura: true,
      },
      orderBy: { fecha: 'desc' },
    });
  }

  async findByUser(profileId: number) {
    return this.prisma.pedido.findMany({
      where: { profileId },
      include: {
        productos: {
          include: {
            producto: {
              include: {
                images: true,
              },
            },
          },
        },
        direccion: true,
        factura: true,
      },
      orderBy: { fecha: 'desc' },
    });
  }

  async findOne(id: number) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        productos: {
          include: {
            producto: {
              include: {
                images: true,
              },
            },
          },
        },
        direccion: true,
        factura: true,
      },
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return pedido;
  }

  //async update(id: number, updatePedidoDto: UpdatePedidoDto) {
  //  const pedido = await this.pedidoRepository.findOneBy({ id });
  //  if (!pedido) {
  //    throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
  //  }

  //  pedido.status = updatePedidoDto.status;
  //  return await this.pedidoRepository.save(pedido);
  //}

  async remove(id: number) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: { productos: true },
    });
    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    // Delete related PedidoProductos first
    await this.prisma.pedidoProducto.deleteMany({
      where: { pedidoId: id },
    });

    await this.prisma.pedido.delete({
      where: { id },
    });

    return { message: 'Pedido eliminado correctamente' };
  }
}
