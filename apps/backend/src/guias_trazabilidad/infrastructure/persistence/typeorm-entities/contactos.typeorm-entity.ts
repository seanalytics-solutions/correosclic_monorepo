export class ContactosTypeormEntity {
  id_contacto: string;

  id_usuario?: string | null;

  nombres: string;

  apellidos: string;

  telefono: string;

  calle: string;

  numero: string;

  numero_interior?: string | null;

  asentamiento: string;

  codigo_postal: string;

  localidad: string;

  estado: string;

  pais: string;

  lat?: number | null;

  lng?: number | null;

  referencia?: string | null;
}
