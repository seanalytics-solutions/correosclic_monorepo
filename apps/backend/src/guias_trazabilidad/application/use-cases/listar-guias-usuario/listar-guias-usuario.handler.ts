import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListarGuiasPorUsuarioQuery } from './listar-guias-usuario.query';
import { Result } from '../../../../utils/result';
import { GuiaListReadModel } from '../../read-models/guia.read-models';
import {
  GuiaReadRepositoryInterface,
  GUIA_READ_REPOSITORY,
} from '../../ports/outbound/guia-read.repository.interface';
import { CloudflareService } from '../../../../cloudflare/cloudflare.service';

@QueryHandler(ListarGuiasPorUsuarioQuery)
export class ListarGuiasPorUsuarioQueryHandler
  implements IQueryHandler<ListarGuiasPorUsuarioQuery>
{
  constructor(
    @Inject(GUIA_READ_REPOSITORY)
    private readonly guiaReadRepository: GuiaReadRepositoryInterface,
    private readonly cloudflareService: CloudflareService,
  ) {}

  async execute(
    query: ListarGuiasPorUsuarioQuery,
  ): Promise<Result<GuiaListReadModel[]>> {
    try {
      const guias = await this.guiaReadRepository.findByProfileId(
        query.profileId,
      );

      // Agregar URL firmada a cada guía
      const guiasConUrl = await Promise.all(
        guias.map(async (guia: GuiaListReadModel & { key_pdf?: string }) => ({
          ...guia,
          pdf_url: guia.key_pdf
            ? await this.cloudflareService.getSignedUrl(guia.key_pdf)
            : null,
        })),
      );

      return Result.success(guiasConUrl);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error desconocido al listar guías del usuario';
      return Result.failure(
        `Error al listar guías del usuario: ${errorMessage}`,
      );
    }
  }
}
