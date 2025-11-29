import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Factura } from '../../facturas/factura.entity';
import { Card } from '../../cards/entities/card.entity';
import { Review } from '../../review/entities/review.entity';

export class Profile {
  @ApiProperty({ example: 7 })
  id: number;

  @ApiProperty({ example: 'Ana' })
  nombre: string;

  @ApiProperty({ example: 'López' })
  apellido: string;

  @ApiProperty({ example: '6181234567' })
  numero: string;

  facturas: Factura[];

  @ApiProperty({ example: 'Durango' })
  estado: string;

  @ApiProperty({ example: 'Durango' })
  ciudad: string;

  @ApiProperty({ example: 'Centro' })
  fraccionamiento: string;

  @ApiProperty({ example: 'Av. Principal 123' })
  calle: string;

  @ApiProperty({ example: '34000' })
  codigoPostal: string;

  @ApiProperty({
    example:
      'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg',
  })
  imagen: string;

  transactions: Transaction[];

  cards: Card[];

  @ApiProperty({ example: 'cus_abc123', nullable: true })
  stripeCustomerId: string | null;

  reviews: Review[];
}
