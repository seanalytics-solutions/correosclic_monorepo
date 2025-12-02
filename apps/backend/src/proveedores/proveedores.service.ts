import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Proveedor } from '@prisma/client';

@Injectable()
export class ProveedoresService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  create(data: Partial<Proveedor>) {
    return this.prisma.proveedor.create({
      data: data as any,
    });
  }

  findBySub(sub: string) {
    return this.prisma.proveedor.findFirst({ where: { sub } });
  }
}
