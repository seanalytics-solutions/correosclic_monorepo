import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OficinasService } from './ubicaciones.service';
import { OficinasController } from './ubicaciones.controller';

@Module({
  imports: [PrismaModule],
  providers: [OficinasService],
  controllers: [OficinasController],
})
export class Ubicaciones {}
