import { Module } from '@nestjs/common';
import { MisdireccionesService } from './misdirecciones.service';
import { MisdireccionesController } from './misdirecciones.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MisdireccionesController],
  providers: [MisdireccionesService],
})
export class MisdireccionesModule {}
