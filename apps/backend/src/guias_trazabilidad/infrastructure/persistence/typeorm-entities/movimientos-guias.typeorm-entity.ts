import { GuiaTypeormEntity } from './guia.typeorm-entity';

export class MovimientoGuiasTypeormEntity {
  id_movimiento: string;

  id_guia: string;
  guia: GuiaTypeormEntity;

  id_sucursal: string; // pendiente tabla sucursales

  id_ruta: string; // pendiente tabla rutas

  estado: string;

  localizacion: string;

  fecha_movimiento: Date;
}
