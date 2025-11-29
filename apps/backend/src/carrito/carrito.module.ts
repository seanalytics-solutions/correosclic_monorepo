import { Module } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CarritoController } from './carrito.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CarritoController],
  providers: [CarritoService],
})
export class CarritoModule {}

