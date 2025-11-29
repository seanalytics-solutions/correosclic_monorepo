import { GuiaTypeormEntity } from './guia.typeorm-entity';

// tabla log, cada registro es inmutable
export class IncidenciasTypeormEntity {
  id_incidencia: string;

  id_guia: string;
  guia: GuiaTypeormEntity;

  tipo_incidencia: string;

  descripcion?: string;

  fecha_incidencia: Date;

  id_usuario_responsable: string; // pendiente tabla usuarios
}
