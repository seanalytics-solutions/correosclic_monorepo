import { Module } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { FacturasController } from './facturas.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [FacturasService],
  controllers: [FacturasController],
  exports: [FacturasService],
})
export class FacturasModule {}
