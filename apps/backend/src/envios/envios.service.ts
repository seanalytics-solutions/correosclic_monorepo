import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnvioDto } from './dto/CrearEnvioDto.dto';

export enum EstadoEnvio {
  PENDIENTE = 'pendiente',
  EN_RUTA = 'en_ruta',
  ENTREGADO = 'entregado',
  FALLIDO = 'fallido',
  REPROGRAMADO = 'reprogramado',
  RETIRAR_SUCURSAL = 'retirar_sucursal',
}

@Injectable()
export class EnviosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.envio.findMany({
      include: { guia: true, unidad: true },
    });
  }

  async findByUnidad(id: number) {
    return this.prisma.envio.findMany({
      where: { id_unidad: id },
      include: { guia: true, unidad: true },
    });
  }

  async findByGuia(id: string) {
    return this.prisma.envio.findMany({
      where: { id_guia: id },
      include: { guia: true, unidad: true },
    });
  }

  async create(dto: CreateEnvioDto) {
    const guia = await this.prisma.guia.findUnique({
      where: { id_guia: dto.guiaId },
      include: { destinatario: true },
    });
    if (!guia) throw new NotFoundException('Guía no encontrada');

    const unidad = await this.prisma.unidad.findUnique({
      where: { id: dto.unidadId },
    });
    if (!unidad) throw new NotFoundException('Unidad no encontrada');

    const fechaAsignacion = new Date();
    const horaLimite = new Date(fechaAsignacion);
    horaLimite.setHours(15, 0, 0, 0);

    const fechaEntrega = new Date(fechaAsignacion);
    if (fechaAsignacion > horaLimite)
      fechaEntrega.setDate(fechaEntrega.getDate() + 1);

    fechaEntrega.setHours(0, 0, 0, 0);

    const envioExistente = await this.prisma.envio.findFirst({
      where: {
        id_guia: dto.guiaId,
        fecha_entrega_programada: fechaEntrega,
      },
    });

    if (envioExistente) {
      throw new BadRequestException(
        `Ya existe un envío programado para la guía ${dto.guiaId} en la fecha ${fechaEntrega.toISOString().slice(0, 10)}.`,
      );
    }

    return this.prisma.envio.create({
      data: {
        id_guia: guia.id_guia,
        id_unidad: unidad.id,
        estado_envio: EstadoEnvio.PENDIENTE,
        fecha_asignacion: fechaAsignacion,
        fecha_entrega_programada: fechaEntrega,
      },
    });
  }

  async findEnviosDeHoyPorUnidad(unidadId: string) {
    const inicioDelDia = new Date();
    inicioDelDia.setHours(0, 0, 0, 0);

    const finDelDia = new Date();
    finDelDia.setHours(23, 59, 59, 999);

    const envios = await this.prisma.envio.findMany({
      where: {
        id_unidad: Number(unidadId),
        fecha_entrega_programada: {
          gte: inicioDelDia,
          lte: finDelDia,
        },
      },
      include: {
        guia: {
          include: {
            destinatario: true,
          },
        },
      },
      orderBy: { fecha_entrega_programada: 'asc' },
    });

    if (!envios || envios.length === 0) {
      throw new NotFoundException(
        `No se encontraron envíos para la unidad ${unidadId} en el día de hoy.`,
      );
    }

    return envios.map((envio) => {
      const contacto = envio.guia.destinatario;
      return {
        id: envio.id,
        estado_envio: envio.estado_envio,
        numero_de_rastreo: envio.guia.numero_de_rastreo,
        calle: contacto?.calle,
        numero: contacto?.numero,
        numero_interior: contacto?.numero_interior,
        asentamiento: contacto?.asentamiento,
        codigo_postal: contacto?.codigo_postal,
        localidad: contacto?.localidad,
        estado: contacto?.estado,
        pais: contacto?.pais,
        lat: contacto?.lat,
        lng: contacto?.lng,
        referencia: contacto?.referencia,
        destinatario: contacto
          ? `${contacto.nombres} ${contacto.apellidos}`
          : null,
      };
    });
  }

  async iniciarRuta(unidadId: number) {
    const hoy = new Date();
    const inicioDelDia = new Date(hoy);
    inicioDelDia.setHours(0, 0, 0, 0);

    const finDelDia = new Date(hoy);
    finDelDia.setHours(23, 59, 59, 999);

    const result = await this.prisma.envio.updateMany({
      where: {
        id_unidad: unidadId,
        fecha_entrega_programada: {
          gte: inicioDelDia,
          lte: finDelDia,
        },
        estado_envio: EstadoEnvio.PENDIENTE,
      },
      data: {
        estado_envio: EstadoEnvio.EN_RUTA,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException(
        `No se encontraron envíos pendientes para la unidad ${unidadId} para el día de hoy.`,
      );
    }

    return { updated: result.count };
  }

  async marcarComoFallido(id: number, motivo: string) {
    const envio = await this.prisma.envio.findUnique({
      where: { id },
      include: { guia: true, unidad: true },
    });

    if (!envio) {
      throw new NotFoundException(`No se encontró un envío con el ID ${id}`);
    }

    await this.prisma.envio.update({
      where: { id },
      data: {
        estado_envio: EstadoEnvio.FALLIDO,
        motivo_fallo: motivo,
        fecha_fallido: new Date(),
      },
    });

    const nuevaFechaEntrega = new Date();
    nuevaFechaEntrega.setDate(nuevaFechaEntrega.getDate() + 1);
    nuevaFechaEntrega.setHours(0, 0, 0, 0);

    const intentosFallidos = await this.prisma.envio.count({
      where: {
        id_guia: envio.id_guia,
        id_unidad: envio.id_unidad,
        estado_envio: EstadoEnvio.FALLIDO,
      },
    });

    if (intentosFallidos >= 3) {
      console.warn(
        `Guía ${envio.id_guia} ha fallado 3 veces. Cambiando a RETIRAR_SUCURSAL.`,
      );

      await this.prisma.envio.create({
        data: {
          id_guia: envio.id_guia,
          id_unidad: envio.id_unidad,
          estado_envio: EstadoEnvio.RETIRAR_SUCURSAL,
          fecha_asignacion: new Date(),
          fecha_entrega_programada: nuevaFechaEntrega,
        },
      });
      return envio;
    }

    const yaExiste = await this.prisma.envio.findFirst({
      where: {
        id_guia: envio.id_guia,
        id_unidad: envio.id_unidad,
        fecha_entrega_programada: nuevaFechaEntrega,
      },
    });

    if (yaExiste) {
      console.warn(
        `Ya existe un reintento para la guía ${envio.id_guia} en la fecha ${nuevaFechaEntrega.toISOString()}`,
      );
      return envio;
    }

    await this.prisma.envio.create({
      data: {
        id_guia: envio.id_guia,
        id_unidad: envio.id_unidad,
        estado_envio: EstadoEnvio.PENDIENTE,
        fecha_asignacion: new Date(),
        fecha_entrega_programada: nuevaFechaEntrega,
      },
    });

    return envio;
  }

  async actualizarEstatus(
    id: number,
    nuevoEstatus: string,
    nombreReceptor: string,
  ) {
    const envio = await this.prisma.envio.findUnique({ where: { id } });

    if (!envio) {
      return null;
    }

    const data: any = { estado_envio: nuevoEstatus };
    const today = new Date();

    if (nuevoEstatus === EstadoEnvio.ENTREGADO) {
      data.fecha_entregado = today;
      if (nombreReceptor) {
        data.nombre_receptor = nombreReceptor;
      }
    } else if (nuevoEstatus === EstadoEnvio.FALLIDO) {
      data.fecha_fallido = today;
    }

    return await this.prisma.envio.update({
      where: { id },
      data,
    });
  }

  async anadirEvidencia(id: number, url: string) {
    const envio = await this.prisma.envio.findUnique({ where: { id } });

    if (!envio) {
      return null;
    }

    return await this.prisma.envio.update({
      where: { id },
      data: { evidencia_entrega: url },
    });
  }
}
