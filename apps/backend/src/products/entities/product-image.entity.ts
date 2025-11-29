import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

export class ProductImage {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({
    example: 'https://bucket.s3.region.amazonaws.com/images/uuid.jpg',
  })
  url: string;

  @ApiProperty({ example: 0 })
  orden: number;

  product: Product;

  @ApiProperty({ example: 12 })
  productId: number;
}
