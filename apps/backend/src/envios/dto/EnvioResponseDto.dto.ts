import { ApiProperty } from '@nestjs/swagger';

export class EnvioResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  id_guia: string;

  @ApiProperty()
  id_unidad: number;

  @ApiProperty()
  estado_envio: string;

  @ApiProperty()
  fecha_asignacion: Date;

  @ApiProperty()
  fecha_entrega_programada: Date;

  @ApiProperty({ required: false })
  fecha_entregado?: Date;

  @ApiProperty({ required: false })
  fecha_fallido?: Date;

  @ApiProperty({ required: false })
  motivo_fallo?: string;

  @ApiProperty({ required: false })
  nombre_receptor?: string;

  @ApiProperty({ required: false })
  evidencia_entrega?: string;
}
