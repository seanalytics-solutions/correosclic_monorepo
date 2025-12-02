import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
import {
  ComplaintStatus,
  ComplaintType,
  ComplaintResolution,
  ComplaintPriority,
} from '../constants';

export class UpdateComplaintDto {
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
    example: ComplaintStatus.IN_REVIEW,
  })
  @IsEnum(ComplaintStatus)
  @IsOptional()
  status?: ComplaintStatus;

  @ApiPropertyOptional({
    description: 'Tipo de queja',
    enum: ComplaintType,
    example: ComplaintType.PRODUCT_ISSUE,
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
  })
  @IsEnum(ComplaintPriority)
  @IsOptional()
  priority?: ComplaintPriority;

  @ApiPropertyOptional({
    description: 'Descripción detallada del problema',
    example: 'Actualización: El cliente proporcionó fotos del daño.',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
