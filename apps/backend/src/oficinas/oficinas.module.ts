import { Module } from '@nestjs/common';
import { OficinasController } from './oficinas.controller';
import { OficinasService } from './oficinas.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OficinasController],
  providers: [OficinasService],
})
export class OficinasModule {}

