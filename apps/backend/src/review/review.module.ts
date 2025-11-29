// src/review/review.module.ts
import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller'; // 👈 singular
import { ReviewService } from './review.service'; // 👈 singular
import { UploadImageService } from '../upload-image/upload-image.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReviewController],
  providers: [ReviewService, UploadImageService],
  exports: [ReviewService],
})
export class ReviewModule {}
