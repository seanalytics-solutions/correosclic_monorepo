import { ApiProperty } from '@nestjs/swagger';
import { Review } from './review.entity';

export class ReviewImage {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'https://res.cloudinary.com/.../default.jpg' })
  url: string;

  @ApiProperty({ example: 0 })
  orden: number;

  review: Review;

  @ApiProperty({ example: 12 })
  reviewId: number;
}
