import { Paquete } from '../../paquete/entities/paquete.entity';

export class AsignacionPaquetes {
  id: number;

  fecha_asignacion: Date;

  idPaquete?: Paquete | null;

  paquete?: Paquete | null;
  idPaqueteId?: number | null;
}
