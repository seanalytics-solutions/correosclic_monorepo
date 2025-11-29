import { Module } from '@nestjs/common';
import { AsignacionPaquetesService } from './asignacion_paquetes.service';
import { AsignacionPaquetesController } from './asignacion_paquetes.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AsignacionPaquetesController],
  providers: [AsignacionPaquetesService],
})
export class AsignacionPaquetesModule {}
