import { Module } from '@nestjs/common';
import { PaquetesService } from './paquetes.service';
import { PaquetesController } from './paquetes.controller';
import { UploadImageModule } from '../upload-image/upload-image.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, UploadImageModule],
  controllers: [PaquetesController],
  providers: [PaquetesService],
})
export class PaquetesModule {}
