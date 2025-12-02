import { TipoVehiculo } from '../entities/tipo-vehiculo.entity';

export class TipoVehiculoOficina {
  id: number;

  // FK a tipos_vehiculos.id
  tipoVehiculoId: number;

  tipoVehiculo: TipoVehiculo;

  // FK a oficinas.tipo_cuo (enum)
  tipoOficina: string;
}
