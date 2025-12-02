import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';
import { Profile } from '../../profile/entities/profile.entity';
import { ReviewImage } from './review-image.entity';

export class Review {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 5, description: 'Puntuación del producto (1-5)' })
  rating: number;

  @ApiProperty({ example: 'Excelente producto, lo recomiendo mucho.' })
  comment: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  product: Product;

  @ApiProperty({ example: 1 })
  productId: number;

  @ApiProperty({
    type: () => Profile,
    example: { id: 7, nombre: 'Ana', apellido: 'López', imagen: 'https://...' },
  })
  profile: Profile;

  @ApiProperty({ example: 7 })
  profileId: number;

  @ApiProperty({ type: () => [ReviewImage] })
  images: ReviewImage[];
}
