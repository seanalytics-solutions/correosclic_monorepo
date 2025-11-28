import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateSellerService } from './create-seller.service';
import { CreateSellerController } from './create-seller.controller';

import { CreateSellerEntity } from './entities/create_seller.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CreateSellerEntity])],
  controllers: [CreateSellerController],
  providers: [CreateSellerService],
  exports: [CreateSellerService],
})
export class CreateSellerModule {}
