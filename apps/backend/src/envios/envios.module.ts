import { Module } from '@nestjs/common';
import { EnviosController } from './envios.controller';
import { EnviosService } from './envios.service';
import { UploadImageModule } from '../upload-image/upload-image.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, UploadImageModule],
  controllers: [EnviosController],
  providers: [EnviosService],
})
export class EnviosModule {}
