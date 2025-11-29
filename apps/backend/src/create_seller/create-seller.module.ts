import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateSellerService } from './create-seller.service';
import { CreateSellerController } from './create-seller.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CreateSellerController],
  providers: [CreateSellerService],
  exports: [CreateSellerService],
})
export class CreateSellerModule {}
