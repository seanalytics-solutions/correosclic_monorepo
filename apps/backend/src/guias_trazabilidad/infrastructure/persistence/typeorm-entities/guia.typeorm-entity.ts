import { ContactosTypeormEntity } from './contactos.typeorm-entity';

export class GuiaTypeormEntity {
  id_guia: string;

  numero_de_rastreo: string;

  situacion_actual: string; // cambiar a enum

  id_remitente: string | null;

  remitente: ContactosTypeormEntity;

  id_destinatario: string | null;

  destinatario: ContactosTypeormEntity;

  alto_cm: number;

  largo_cm: number;

  ancho_cm: number;

  peso_kg: number;

  valor_declarado: number;

  fecha_creacion: Date;

  fecha_actualizacion: Date;

  fecha_entrega_estimada: Date;

  key_pdf: string | null;

  profile_id: number | null;
}
