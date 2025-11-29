import { ApiProperty } from '@nestjs/swagger';
import { GiftedCouponEntity } from '../../coupons/entities/gifted-coupon.entity';

export class User {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Juan Pérez' })
  nombre: string;

  @ApiProperty({ example: 'juan@example.com' })
  correo: string;

  @ApiProperty({ example: 'hashedPassword' })
  contrasena: string | null;

  @ApiProperty({ example: 'usuario' })
  rol: string;

  giftedCoupons: GiftedCouponEntity[];
}
