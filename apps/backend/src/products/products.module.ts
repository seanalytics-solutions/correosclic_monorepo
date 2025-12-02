import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadImageModule } from '../upload-image/upload-image.module'; // Import the UploadImageModule

@Module({
  imports: [PrismaModule, UploadImageModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
