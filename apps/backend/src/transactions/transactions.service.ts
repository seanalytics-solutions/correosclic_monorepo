import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto) {
    return this.prisma.$transaction(async (tx) => {
      const profile = await tx.profile.findUnique({
        where: { id: createTransactionDto.profileId },
      });
      if (!profile) {
        throw new NotFoundException(
          `El perfil con el ID: ${createTransactionDto.profileId} no existe`,
        );
      }

      const total = createTransactionDto.contenidos.reduce(
        (sum, item) => sum + item.cantidad * item.precio,
        0,
      );

      const transaction = await tx.transaction.create({
        data: {
          profileId: createTransactionDto.profileId,
          total: total,
        },
      });

      for (const contentItem of createTransactionDto.contenidos) {
        const product = await tx.product.findUnique({
          where: { id: contentItem.productId },
        });
        if (!product) {
          throw new NotFoundException(
            `El producto con el ID: ${contentItem.productId} no existe`,
          );
        }
        // Original code saved product but didn't modify it. Skipping save.

        await tx.transactionContent.create({
          data: {
            precio: contentItem.precio,
            cantidad: contentItem.cantidad,
            productoId: contentItem.productId,
            transactionId: transaction.id,
          },
        });
      }

      return { message: 'Venta almacenada correctamente' };
    });
  }

  // Devuelve todas las transacciones (con detalles)
  async findAll() {
    return this.prisma.transaction.findMany({
      include: { contenidos: { include: { producto: true } } },
      orderBy: { diaTransaccion: 'desc' },
    });
  }

  // Nuevo método para todas las compras de un usuario
  async findByProfile(profileId: number) {
    return this.prisma.transaction.findMany({
      where: { profileId },
      include: { contenidos: { include: { producto: true } } },
      orderBy: { diaTransaccion: 'desc' },
    });
  }

  // Obtener una única transacción por su ID
  async findOne(id: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: { contenidos: { include: { producto: true } } },
    });
    if (!transaction) {
      throw new NotFoundException(`Transacción con ID: ${id} no encontrada`);
    }
    return transaction;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
