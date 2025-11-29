import { Injectable } from '@nestjs/common';
import { GuiaRepositoryInterface } from '../../../application/ports/outbound/guia.repository.interface';
import { GuiaDomainEntity } from '../../../business-logic/guia.domain-entity-root';
import { GuiaMapper } from '../../mappers/guia.mapper';
import { ContactoMapper } from '../../mappers/contacto.mapper';
import { MovimientoMapper } from '../../mappers/movimiento.mapper';
import { NumeroDeRastreoVO } from '../../../business-logic/value-objects/numeroRastreo.vo';
import { IncidenciaMapper } from '../../mappers/incidencia.mapper';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class GuiaRepository implements GuiaRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async save(guia: GuiaDomainEntity): Promise<void> {
    const remitenteOrm = ContactoMapper.toOrm(guia.Remitente);
    const destinatarioOrm = ContactoMapper.toOrm(guia.Destinatario);
    const guiaOrm = GuiaMapper.toOrm(guia);

    await this.prisma.$transaction(async (tx) => {
      // Upsert remitente
      await tx.contactoGuia.upsert({
        where: { id_contacto: remitenteOrm.id_contacto },
        update: { ...remitenteOrm },
        create: { ...remitenteOrm },
      });

      // Upsert destinatario
      await tx.contactoGuia.upsert({
        where: { id_contacto: destinatarioOrm.id_contacto },
        update: { ...destinatarioOrm },
        create: { ...destinatarioOrm },
      });

      // Upsert guia
      // Remove relation objects to avoid Prisma errors
      const { remitente, destinatario, ...guiaData } = guiaOrm;
      const guiaInput = {
        ...guiaData,
        id_remitente: remitenteOrm.id_contacto,
        id_destinatario: destinatarioOrm.id_contacto,
      };

      await tx.guia.upsert({
        where: { id_guia: guiaInput.id_guia },
        update: guiaInput,
        create: guiaInput,
      });

      if (guia.UltimoMovimiento) {
        const movimientoOrm = MovimientoMapper.toOrm(guia.UltimoMovimiento);
        movimientoOrm.id_guia = guiaOrm.id_guia;
        
        const { guia: _guiaMov, ...movimientoData } = movimientoOrm;

        await tx.movimientoGuia.upsert({
          where: { id_movimiento: movimientoData.id_movimiento },
          update: movimientoData,
          create: movimientoData,
        });
      }

      if (guia.incidencia) {
        const incidenciaOrm = IncidenciaMapper.toOrm(
          guia.incidencia,
          guia.Id.getId,
        );
        
        const { guia: _guiaInc, ...incidenciaData } = incidenciaOrm;

        await tx.incidenciaGuia.upsert({
          where: { id_incidencia: incidenciaData.id_incidencia },
          update: incidenciaData,
          create: incidenciaData,
        });
      }
    });
  }

  async findByNumeroRastreo(
    numeroRastreo: NumeroDeRastreoVO,
  ): Promise<GuiaDomainEntity | null> {
    const guiaOrm = await this.prisma.guia.findUnique({
      where: { numero_de_rastreo: numeroRastreo.getNumeroRastreo },
      include: {
        remitente: true,
        destinatario: true,
      },
    });

    if (!guiaOrm) {
      return null;
    }

    const movimientoOrm = await this.prisma.movimientoGuia.findFirst({
      where: { id_guia: guiaOrm.id_guia },
      orderBy: { fecha_movimiento: 'desc' },
    });

    return GuiaMapper.toDomain(
      guiaOrm as any,
      guiaOrm.remitente as any,
      guiaOrm.destinatario as any,
      (movimientoOrm as any) ?? undefined,
    );
  }
}
