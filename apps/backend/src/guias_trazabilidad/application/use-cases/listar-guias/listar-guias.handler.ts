import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListarGuiasQuery } from './listar-guias.query';
import { Result } from '../../../../utils/result';
import { GuiaListReadModel } from '../../read-models/guia.read-models';
import {
  GuiaReadRepositoryInterface,
  GUIA_READ_REPOSITORY,
} from '../../ports/outbound/guia-read.repository.interface';
import { CloudflareService } from '../../../../cloudflare/cloudflare.service';

@QueryHandler(ListarGuiasQuery)
export class ListarGuiasQueryHandler
  implements IQueryHandler<ListarGuiasQuery>
{
  constructor(
    @Inject(GUIA_READ_REPOSITORY)
    private readonly guiaReadRepository: GuiaReadRepositoryInterface,
    private readonly cloudflareService: CloudflareService,
  ) {}

  async execute(query: ListarGuiasQuery): Promise<Result<GuiaListReadModel[]>> {
    const guias = await this.guiaReadRepository.findAllGuias();
    const guiasConUrl = await Promise.all(
      guias.map(async (guia: GuiaListReadModel & { key_pdf?: string }) => ({
        ...guia,
        pdf_url: guia.key_pdf
          ? await this.cloudflareService.getSignedUrl(guia.key_pdf)
          : null,
      })),
    );
    return Result.success(guiasConUrl);
  }
  catch(error: any) {
    const errorMessage =
      error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : String(error);
    return Result.failure(`Error al listar guías: ${errorMessage}`);
  }
}
