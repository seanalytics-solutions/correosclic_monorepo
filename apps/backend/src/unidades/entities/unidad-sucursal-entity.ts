export class UnidadSucursal {
  id: number;

  idUnidad: number;

  claveSucursal: string;

  estadoUnidad: 'transito' | 'disponible' | 'mantenimiento' | 'no disponible';

  conductorUnidad: string;
}
