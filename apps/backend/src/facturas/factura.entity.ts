import { Profile } from '../profile/entities/profile.entity';
import { ApiProperty } from '@nestjs/swagger';

export class Factura {
  @ApiProperty({ example: 1, description: 'ID único de la factura' })
  id: number;

  @ApiProperty({
    type: () => Profile,
    description: 'Perfil al que pertenece la factura',
  })
  profile: Profile;

  @ApiProperty({
    example: 'F-2025-001',
    description: 'Número único de la factura',
  })
  numero_factura: string;

  @ApiProperty({
    example: 500.75,
    description: 'Monto total de la factura en MXN',
  })
  precio: number;

  @ApiProperty({
    example: 'Sucursal Centro',
    description: 'Nombre del cliente o sucursal',
  })
  sucursal: string;

  @ApiProperty({
    example: 'paid',
    description: "Estado de la factura: 'paid', 'pending', 'overdue'",
  })
  status: string;

  @ApiProperty({
    example: ['Producto A', 'Producto B'],
    description: 'Lista de productos incluidos',
  })
  productos: string[];

  @ApiProperty({
    example: '2025-08-06',
    description: 'Fecha de creación de la factura',
  })
  fecha_creacion: Date;

  @ApiProperty({
    example: '2025-09-06',
    description: 'Fecha de vencimiento de la factura',
  })
  fecha_vencimiento: Date;
}
