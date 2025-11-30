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
      // Update the include property with the correct relation name or remove it if not needed
      // include: { correctRelationName: true },
    });
  }
}
