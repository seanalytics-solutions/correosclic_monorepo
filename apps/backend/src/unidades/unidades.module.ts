import { Module } from '@nestjs/common';
import { UnidadesController } from './unidades.controller';
import { UnidadesService } from './unidades.service';
import { ConductoresModule } from '../conductores/conductores.module';
import { HistorialAsignacionesModule } from '../historial-asignaciones/historial-asignaciones.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, ConductoresModule, HistorialAsignacionesModule],
  controllers: [UnidadesController],
  providers: [UnidadesService],
  exports: [UnidadesService],
})
export class UnidadesModule {}
