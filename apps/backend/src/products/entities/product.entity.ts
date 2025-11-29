import { ApiProperty } from '@nestjs/swagger';
import { ProductImage } from './product-image.entity';
import { Review } from '../../review/entities/review.entity';
import { CreatedCouponEntity } from '../../coupons/entities/created-coupon.entity';

export class Product {
  @ApiProperty({ example: 12 })
  id: number;

  @ApiProperty({ example: 'Tenis Runner' })
  nombre: string;

  @ApiProperty({ example: 'Tenis deportivos para correr' })
  descripcion: string;

  @ApiProperty({ example: '120 cm' })
  altura: number | null;

  @ApiProperty({ example: '120 cm' })
  largo: number | null;

  @ApiProperty({ example: '120 cm' })
  ancho: number | null;

  @ApiProperty({ example: '2kg' })
  peso: number | null;

  @ApiProperty({ example: 1299.9, type: Number })
  precio: number;

  @ApiProperty({ example: 25 })
  inventario: number;

  @ApiProperty({ example: 'Negro' })
  color: string;

  @ApiProperty({ example: 'Nike' })
  marca: string;

  @ApiProperty({ example: 'tenis-runner-negro' })
  slug: string;

  @ApiProperty({ example: 'SportCenter MX' })
  vendedor: string;

  @ApiProperty({ example: true })
  estado: boolean;

  @ApiProperty({ example: 132 })
  vendidos: number;

  @ApiProperty({ example: 'SKU-ABC-001' })
  sku: string;

  @ApiProperty({ example: 1 })
  idPerfil: number | null;

  @ApiProperty({ example: '2', nullable: true })
  id_category: number | null;

  @ApiProperty({ type: () => [ProductImage] })
  images: ProductImage[];

  @ApiProperty({
    type: () => [Review],
    example: [
      {
        id: 1,
        rating: 5,
        comment: 'Excelente calidad',
        createdAt: '2025-08-09T12:00:00.000Z',
        updatedAt: '2025-08-09T12:00:00.000Z',
        productId: 1,
        profileId: 3,
        images: [
          {
            id: 10,
            url: 'https://res.cloudinary.com/.../rev1.jpg',
            orden: 0,
            reviewId: 1,
          },
        ],
      },
    ],
  })
  reviews: Review[];

  createdCoupons?: CreatedCouponEntity[];
}
