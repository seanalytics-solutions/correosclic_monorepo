import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';
import {
  ComplaintStatus,
  ComplaintType,
  ComplaintResolution,
  ComplaintPriority,
} from '../entities/complaint.entity';

export class CreateComplaintDto {
  @ApiProperty({
    description: 'ID del perfil del usuario que crea la queja',
    example: 1,
  })
  @IsInt()
  profileId: number;

  @ApiPropertyOptional({
    description: 'ID del pedido relacionado (opcional)',
    example: 5,
  })
  @IsInt()
  @IsOptional()
  orderId?: number;

  @ApiPropertyOptional({
    description: 'IDs de los productos defectuosos del pedido',
    example: [12, 15],
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  defectiveProductIds?: number[];

  @ApiPropertyOptional({
    description: 'Estado de la queja',
    enum: ComplaintStatus,
    example: ComplaintStatus.PENDING,
    default: ComplaintStatus.PENDING,
  })
  @IsEnum(ComplaintStatus)
  @IsOptional()
  status?: ComplaintStatus;

  @ApiPropertyOptional({
    description: 'Tipo de queja',
    enum: ComplaintType,
    example: ComplaintType.PRODUCT_ISSUE,
    default: ComplaintType.OTHER,
  })
  @IsEnum(ComplaintType)
  @IsOptional()
  type?: ComplaintType;

  @ApiPropertyOptional({
    description: 'Resolución aplicada',
    enum: ComplaintResolution,
    example: ComplaintResolution.REFUND,
  })
  @IsEnum(ComplaintResolution)
  @IsOptional()
  resolution?: ComplaintResolution;

  @ApiPropertyOptional({
    description: 'Prioridad de la queja',
    enum: ComplaintPriority,
    example: ComplaintPriority.HIGH,
    default: ComplaintPriority.MEDIUM,
  })
  @IsEnum(ComplaintPriority)
  @IsOptional()
  priority?: ComplaintPriority;

  @ApiProperty({
    description: 'Descripción detallada del problema',
    example:
      'El producto llegó dañado, la caja estaba rota y el artículo tiene rasguños visibles.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
