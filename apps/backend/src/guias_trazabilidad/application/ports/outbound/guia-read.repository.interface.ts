import {
  GuiaReadModel,
  GuiaListReadModel,
  TrazabilidadReadModel,
  IncidenciaReadModel,
  ContactoReadModel,
} from '../../read-models/guia.read-models';

export interface GuiaReadRepositoryInterface {
  findByNumeroRastreo(
    numeroRastreo: string,
  ): Promise<TrazabilidadReadModel | null>;
  findAllGuias(): Promise<GuiaListReadModel[]>;
  findAllIncidencias(): Promise<IncidenciaReadModel[]>;
  findAllContactos(): Promise<ContactoReadModel[]>;
  findByProfileId(profileId: number): Promise<GuiaListReadModel[]>;
}

export const GUIA_READ_REPOSITORY = Symbol('GuiaReadRepository');
