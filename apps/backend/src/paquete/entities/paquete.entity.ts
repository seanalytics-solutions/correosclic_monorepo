export class Paquete {
  id: number;

  estatus: string;

  calle: string;

  colonia: string;

  cp: string;

  indicaciones?: string | null;

  numero_guia: string;

  sku: string;

  longitud: number;

  latitud: number;

  evidencia: string | null;

  fecha_creacion: Date;
}
