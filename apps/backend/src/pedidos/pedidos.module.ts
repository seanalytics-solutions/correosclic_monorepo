import { Module } from '@nestjs/common';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}

