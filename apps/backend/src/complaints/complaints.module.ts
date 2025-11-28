import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';
import { Complaint } from './entities/complaint.entity';
import { PedidoProducto } from '../pedidos/entities/pedido.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Complaint, PedidoProducto])],
  controllers: [ComplaintsController],
  providers: [ComplaintsService],
})
export class ComplaintsModule {}
