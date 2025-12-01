import { Injectable } from '@nestjs/common';
import {
  NotFoundException,
  BadRequestException,
} from '@nestjs/common/exceptions';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistorialAsignacionesService {
  constructor(private prisma: PrismaService) {}

  async registrarAsignacion(
    nombreConductor: string,
    curp: string,
    placasUnidad: string,
    oficinaSalida: string,
    claveCuoDestino: string | null,
  ) {
    return this.prisma.historialAsignacion.create({
      data: {
        nombreConductor,
        curp: curp.toUpperCase(),
        placasUnidad,
        claveOficinaSalida: oficinaSalida,
        claveOficinaDestino: claveCuoDestino ?? '',
        claveOficinaActual: oficinaSalida, // Inicialmente está en la oficina de salida
      },
    });
  }

  async registrarLlegadaDestino(
    curp: string,
    placasUnidad: string,
    claveOficinaActual: string,
  ) {
    const asignacion = await this.prisma.historialAsignacion.findFirst({
      where: {
        curp: curp.toUpperCase(),
        placasUnidad,
        fechaLlegadaDestino: null,
      },
      orderBy: { fechaAsignacion: 'desc' },
    });

    if (!asignacion) {
      throw new NotFoundException('Asignación activa no encontrada');
    }

    return this.prisma.historialAsignacion.update({
      where: { id: asignacion.id },
      data: {
        claveOficinaActual: claveOficinaActual,
        fechaLlegadaDestino: new Date(),
      },
    });
  }

  async finalizarAsignacion(curp: string, placasUnidad: string): Promise<void> {
    // Prisma updateMany doesn't support order/limit directly in the same way,
    // but here we want to update active assignments.
    // Assuming we want to close the active one.

    // Find active assignment first to be safe or updateMany where fechaFinalizacion is null
    await this.prisma.historialAsignacion.updateMany({
      where: {
        curp: curp.toUpperCase(),
        placasUnidad,
        fechaFinalizacion: null,
      },
      data: { fechaFinalizacion: new Date() },
    });
  }

  async getHistorial(placas?: string, curp?: string) {
    const where: {
      placasUnidad?: string;
      curp?: string;
    } = {};
    if (placas) where.placasUnidad = placas;
    if (curp) where.curp = curp.toUpperCase();

    return this.prisma.historialAsignacion.findMany({
      where,
      orderBy: { fechaAsignacion: 'desc' },
    });
  }

  async registrarRetornoOrigen(curp: string, placasUnidad: string) {
    const asignacion = await this.prisma.historialAsignacion.findFirst({
      where: {
        curp: curp.toUpperCase(),
        placasUnidad,
        fechaFinalizacion: null,
      },
      orderBy: { fechaAsignacion: 'desc' },
    });

    if (!asignacion) {
      throw new NotFoundException('Asignación activa no encontrada');
    }

    // Verificar que primero haya llegado al destino
    if (!asignacion.fechaLlegadaDestino) {
      throw new BadRequestException('La unidad debe llegar al destino primero');
    }

    return this.prisma.historialAsignacion.update({
      where: { id: asignacion.id },
      data: {
        claveOficinaActual: asignacion.claveOficinaSalida, // Regresa al origen
        fechaFinalizacion: new Date(),
      },
    });
  }
}
