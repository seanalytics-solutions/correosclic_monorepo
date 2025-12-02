import { Module } from '@nestjs/common';
import { OrdenController } from './orden.controller';
import { OrdenService } from './orden.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OrdenController],
  providers: [OrdenService],
})
export class OrdenModule {}
