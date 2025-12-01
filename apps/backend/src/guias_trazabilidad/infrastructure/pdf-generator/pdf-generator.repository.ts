import { Injectable } from '@nestjs/common';
import { Result } from '../../../utils/result';
import { PDFGeneratorRepositoryInterface } from '../../application/ports/outbound/pdf-generator.repository.interface';
import { plantillaGuiaInternacional } from './plantillas/guia-plantilla-internacional';
import { GuiaDomainEntity } from '../../../guias_trazabilidad/business-logic/guia.domain-entity-root';
import { GuiaMapper } from '../mappers/guia.mapper';
import { plantillaGuiaNacional } from './plantillas/guia-plantilla-nacional';
// Cambiar a default import
import ReactPDF from '@react-pdf/renderer';

@Injectable()
export class PDFGeneratorRepository implements PDFGeneratorRepositoryInterface {
  async generarGuiaPDFNacional(
    pdfPayload: GuiaDomainEntity,
    qrCodeDataURL: string,
  ): Promise<Result<Buffer>> {
    try {
      console.log('🚀 Iniciando generación de PDF...');
      const data = GuiaMapper.toPdfPayload(pdfPayload);
      console.log('📄 PDF Data:', JSON.stringify(data, null, 2));
      console.log('📷 QR URL length:', qrCodeDataURL?.length);

      const GuiaDocument = await plantillaGuiaNacional(data, qrCodeDataURL);
      console.log('📑 Document created:', !!GuiaDocument);

      // Usar ReactPDF.pdf en lugar de pdf directamente
      const pdfBlob = await ReactPDF.pdf(GuiaDocument).toBlob();
      const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

      return Result.success(pdfBuffer);
    } catch (error) {
      console.error('❌ Error:', error);
      return Result.failure(`Error generando PDF: ${error.message}`);
    }
  }

  async generarGuiaPDFInternacional(
    pdfPayload: GuiaDomainEntity,
    qrCodeDataURL: string,
  ): Promise<Result<Buffer>> {
    try {
      const data = GuiaMapper.toPdfPayload(pdfPayload);
      const GuiaDocument = await plantillaGuiaInternacional(
        data,
        qrCodeDataURL,
      );

      const pdfBlob = await ReactPDF.pdf(GuiaDocument).toBlob();
      const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

      return Result.success(pdfBuffer);
    } catch (error) {
      return Result.failure(`Error generando PDF: ${error.message}`);
    }
  }
}
