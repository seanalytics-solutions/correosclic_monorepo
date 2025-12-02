import { IQuery } from '@nestjs/cqrs';

export class ListarGuiasPorUsuarioQuery implements IQuery {
  constructor(public readonly profileId: number) {}
}
