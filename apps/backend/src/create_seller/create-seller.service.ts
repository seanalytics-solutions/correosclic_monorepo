import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSellerDto } from './dto/create-seller.dto';

@Injectable()
export class CreateSellerService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.createSeller.findMany({
        orderBy: { id: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.createSeller.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const seller = await this.prisma.createSeller.findUnique({ where: { id } });

    if (!seller) {
      throw new NotFoundException('seller not found');
    }

    return seller;
  }

  async update(id: number, dto: CreateSellerDto) {
    await this.findOne(id);
    await this.prisma.createSeller.update({
      where: { id },
      data: dto,
    });
    return { ok: true, message: 'Seller Updated' };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.createSeller.delete({ where: { id } });
    return { message: 'Seller has been deleted' };
  }

  async save(seller: CreateSellerDto) {
    return this.prisma.createSeller.create({ data: seller });
  }
}
