import { Module } from '@nestjs/common';
import { ConductoresController } from './conductores.controller';
import { ConductoresService } from './conductores.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConductoresController],
  providers: [ConductoresService],
})
export class ConductoresModule {}
