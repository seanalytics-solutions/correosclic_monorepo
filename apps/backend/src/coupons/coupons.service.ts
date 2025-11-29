import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  findAllCreated() {
    return this.prisma.createdCoupon.findMany({
      include: { product: true },
    });
  }

  findAllGifted() {
    return this.prisma.giftedCoupon.findMany({
      include: { user: true },
    });
  }
}
