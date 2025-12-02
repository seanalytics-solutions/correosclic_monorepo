export class HistorialAsignacion {
  id: number;

  nombreConductor: string;

  curp: string;

  placasUnidad: string;

  claveOficinaSalida: string;

  claveOficinaDestino: string | null;

  claveOficinaActual: string | null;

  fechaAsignacion: Date;

  fechaLlegadaDestino: Date | null;

  fechaFinalizacion: Date | null;
}
