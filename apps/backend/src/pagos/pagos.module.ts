import { Module } from '@nestjs/common';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { FacturasModule } from '../facturas/facturas.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, FacturasModule],
  controllers: [PagosController],
  providers: [PagosService],
  exports: [PagosService],
})
export class PagosModule {}
