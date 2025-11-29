import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HistorialAsignacionesService } from './historial-asignaciones.service';
import { HistorialAsignacionesController } from './historial-asignaciones.controller';

@Module({
  imports: [PrismaModule],
  controllers: [HistorialAsignacionesController],
  providers: [HistorialAsignacionesService],
  exports: [HistorialAsignacionesService],
})
export class HistorialAsignacionesModule {}
