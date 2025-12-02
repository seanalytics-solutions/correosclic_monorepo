import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { AssignConductorDto } from './dto/assign-conductor.dto';
import { AssignZonaDto } from './dto/assign-zona.dto';
import { UnidadResponseDto } from './dto/unidad-response.dto';
import { OficinaTipoVehiculoDto } from './dto/oficina-tipo-vehiculo.dto';
import { HistorialAsignacionesService } from '../historial-asignaciones/historial-asignaciones.service';
import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UnidadesService {
  constructor(
    private prisma: PrismaService,
    private historialSvc: HistorialAsignacionesService,
  ) {}

  async findAll(): Promise<UnidadResponseDto[]> {
    const all = await this.prisma.unidad.findMany({
      include: { tipoVehiculo: true, oficina: true, conductor: true },
    });
    return all.map((u) => this.mapToResponse(u));
  }

  async findByOficina(
    claveOficina: string,
  ): Promise<Omit<UnidadResponseDto, 'claveOficina' | 'estado'>[]> {
    const list = await this.prisma.unidad.findMany({
      where: {
        oficina: { clave_cuo: claveOficina },
        estado: 'disponible',
      },
      include: { tipoVehiculo: true, oficina: true, conductor: true },
    });
    return list.map((u) => {
      const { estado, claveOficina, ...rest } = this.mapToResponse(u);
      return rest;
    });
  }

  async create(dto: CreateUnidadDto): Promise<UnidadResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      const oficina = await tx.oficina.findUnique({
        where: { clave_cuo: dto.claveOficina },
      });
      if (!oficina) {
        throw new NotFoundException(
          `Oficina con clave ${dto.claveOficina} no encontrada`,
        );
      }

      const permiso = await tx.tipoVehiculoOficina.findFirst({
        where: {
          tipoOficina: oficina.tipo_cuo,
          tipoVehiculo: { tipoVehiculo: dto.tipoVehiculo },
        },
        include: { tipoVehiculo: true },
      });
      if (!permiso) {
        throw new ConflictException(
          `Tipo de vehículo no permitido para oficina tipo ${oficina.tipo_cuo}`,
        );
      }

      const tv = await tx.tipoVehiculo.findUnique({
        where: { tipoVehiculo: dto.tipoVehiculo },
      });
      if (!tv) {
        throw new NotFoundException(
          `Tipo de vehículo ${dto.tipoVehiculo} no encontrado`,
        );
      }

      const nueva = await tx.unidad.create({
        data: {
          tipoVehiculoId: tv.id,
          placas: dto.placas,
          volumenCarga: dto.volumenCarga,
          numEjes: dto.numEjes,
          numLlantas: dto.numLlantas,
          tarjetaCirculacion: dto.tarjetaCirculacion,
          fechaAlta: new Date(),
          estado: 'disponible',
          claveOficina: oficina.clave_cuo,
        },
        include: { tipoVehiculo: true, oficina: true, conductor: true },
      });

      return this.mapToResponse(nueva);
    });
  }

  async assignConductor(
    placas: string,
    dto: AssignConductorDto,
  ): Promise<UnidadResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      const unidad = await tx.unidad.findUnique({
        where: { placas },
        include: { oficina: true, conductor: true, tipoVehiculo: true },
      });

      if (!unidad)
        throw new NotFoundException(
          `Unidad con placas ${placas} no encontrada`,
        );

      // Desasignar conductor
      if (dto.curpConductor === 'S/C') {
        if (unidad.conductor) {
          // 1. Registrar retorno al origen en el historial
          await this.historialSvc.registrarRetornoOrigen(
            unidad.conductor.curp,
            placas,
          );

          // 2. Liberar al conductor
          await tx.conductor.update({
            where: { curp: unidad.conductor.curp },
            data: { disponibilidad: true },
          });
        }

        // 3. Limpiar la relación y establecer curp_conductor como null
        const upd = await tx.unidad.update({
          where: { placas },
          data: {
            curpConductor: null,
            estado: 'disponible',
          },
          include: { oficina: true, conductor: true, tipoVehiculo: true },
        });

        return this.mapToResponse(upd);
      }

      // Resto del código para asignación normal...
      const conductor = await tx.conductor.findFirst({
        where: {
          curp: dto.curpConductor,
          oficina: {
            clave_oficina_postal: unidad.oficina.clave_oficina_postal,
          },
        },
        include: { oficina: true },
      });

      if (!conductor) {
        throw new NotFoundException(
          `Conductor ${dto.curpConductor} no encontrado en oficina ${unidad.oficina.clave_oficina_postal}`,
        );
      }

      if (!conductor.disponibilidad || !conductor.licenciaVigente) {
        throw new ConflictException(
          'Conductor no disponible o licencia no vigente',
        );
      }

      if (unidad.conductor) {
        await this.historialSvc.finalizarAsignacion(
          unidad.conductor.curp,
          placas,
        );
        await tx.conductor.update({
          where: { curp: unidad.conductor.curp },
          data: { disponibilidad: true },
        });
      }

      await this.historialSvc.registrarAsignacion(
        conductor.nombreCompleto,
        conductor.curp,
        placas,
        unidad.oficina.clave_cuo,
        unidad.zonaAsignada,
      );

      await tx.conductor.update({
        where: { curp: conductor.curp },
        data: { disponibilidad: false },
      });

      const upd = await tx.unidad.update({
        where: { placas },
        data: {
          curpConductor: conductor.curp,
          estado: 'no disponible',
        },
        include: { oficina: true, conductor: true, tipoVehiculo: true },
      });

      return this.mapToResponse(upd);
    });
  }

  async assignZona(
    placas: string,
    dto: AssignZonaDto,
  ): Promise<UnidadResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Obtener unidad con relaciones
      const unidad = await tx.unidad.findUnique({
        where: { placas },
        include: { oficina: true, tipoVehiculo: true, conductor: true },
      });

      if (!unidad)
        throw new NotFoundException(
          `Unidad con placas ${placas} no encontrada`,
        );
      if (!unidad.oficina)
        throw new BadRequestException(`La unidad no tiene oficina asignada`);

      const oficinaOrigen = unidad.oficina;

      // 2. Validar no auto-asignación
      if (dto.claveCuoDestino === oficinaOrigen.clave_cuo) {
        throw new BadRequestException(
          `No puedes asignar la unidad a su misma oficina de origen`,
        );
      }

      // 3. Buscar oficina destino
      const oficinaDestino = await tx.oficina.findUnique({
        where: { clave_cuo: dto.claveCuoDestino },
      });
      if (!oficinaDestino)
        throw new NotFoundException(`Oficina destino no encontrada`);

      // 4. Obtener claves de zona de la oficina origen
      const clavesZonaOrigen = oficinaOrigen.clave_unica_zona
        ? oficinaOrigen.clave_unica_zona.split(',').map((z) => z.trim())
        : [];

      // 5. Verificar si el destino está en las claves de zona del origen
      if (!clavesZonaOrigen.includes(dto.claveCuoDestino)) {
        // Si no está, verificar relación inversa
        const clavesZonaDestino = oficinaDestino.clave_unica_zona
          ? oficinaDestino.clave_unica_zona.split(',').map((z) => z.trim())
          : [];

        if (!clavesZonaDestino.includes(oficinaOrigen.clave_cuo)) {
          // Si no hay relación bidireccional, obtener destinos permitidos
          const destinosPermitidos =
            await this.getOficinasDestinoValidas(placas);

          throw new BadRequestException(
            `Ruta no permitida. Destinos válidos para ${oficinaOrigen.clave_cuo}: ` +
              (destinosPermitidos.length > 0
                ? destinosPermitidos.map((o) => o.clave_cuo).join(', ')
                : 'No hay destinos válidos'),
          );
        }
      }

      // 6. Actualizar la zona asignada
      const upd = await tx.unidad.update({
        where: { placas },
        data: { zonaAsignada: oficinaDestino.clave_cuo },
        include: { oficina: true, tipoVehiculo: true, conductor: true },
      });

      // 7. Registrar en historial si hay conductor
      if (unidad.conductor) {
        await this.historialSvc.registrarAsignacion(
          unidad.conductor.nombreCompleto,
          unidad.conductor.curp,
          placas,
          unidad.oficina.clave_cuo,
          upd.zonaAsignada,
        );
      }

      return this.mapToResponse(upd);
    });
  }

  async getTiposVehiculoPorOficina(
    claveOficina: string,
  ): Promise<OficinaTipoVehiculoDto> {
    const oficina = await this.prisma.oficina.findUnique({
      where: { clave_cuo: claveOficina },
    });
    if (!oficina) {
      throw new NotFoundException(
        `Oficina con clave ${claveOficina} no encontrada`,
      );
    }

    const list = await this.prisma.tipoVehiculoOficina.findMany({
      where: { tipoOficina: oficina.tipo_cuo },
      include: { tipoVehiculo: true },
    });

    if (list.length === 0) {
      return {
        claveOficina,
        nombreOficina: oficina.nombre_cuo,
        tipo: oficina.tipo_cuo,
        tiposVehiculo: [],
        mensaje: 'Esta oficina no tiene tipos de vehículo asignados',
      };
    }

    return {
      claveOficina,
      nombreOficina: oficina.nombre_cuo,
      tipo: oficina.tipo_cuo,
      tiposVehiculo: list.map((t) => t.tipoVehiculo.tipoVehiculo),
    };
  }

  async getOficinasDestinoValidas(placas: string) {
    const unidad = await this.prisma.unidad.findUnique({
      where: { placas },
      include: { oficina: true },
    });

    if (!unidad?.oficina)
      throw new NotFoundException('Unidad u oficina no encontrada');

    const oficinaOrigen = unidad.oficina;
    const clavesZonaOrigen = oficinaOrigen.clave_unica_zona
      ? oficinaOrigen.clave_unica_zona.split(',').map((z) => z.trim())
      : [];

    // 1. Oficinas que están en las claves de zona del origen (destinos directos)
    const destinosDirectos = await this.prisma.oficina.findMany({
      where: {
        clave_cuo: { in: clavesZonaOrigen },
        activo: true,
      },
    });

    // 2. Oficinas que tienen al origen en sus claves de zona (relación inversa)
    const destinosInversos = await this.prisma.$queryRaw`
      SELECT * FROM oficinas 
      WHERE ${oficinaOrigen.clave_cuo} = ANY(STRING_TO_ARRAY(clave_unica_zona, ','))
      AND activo = true
    `;

    // Combinar y eliminar duplicados usando un Map
    const destinosUnicos = new Map<string, any>();

    [...destinosDirectos, ...(destinosInversos as any[])].forEach((oficina) => {
      if (oficina.clave_cuo !== oficinaOrigen.clave_cuo) {
        destinosUnicos.set(oficina.clave_cuo, oficina);
      }
    });

    return Array.from(destinosUnicos.values());
  }

  async generarQRsDeUnidades(): Promise<
    { id: string; qr: string; filePath: string }[]
  > {
    const unidades = await this.prisma.unidad.findMany();
    const outputDir = path.join(__dirname, 'qrs');

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const resultados = await Promise.all(
      unidades.map(async (unidad) => {
        const placasSanitizado = unidad.placas.replace(/[^a-zA-Z0-9_-]/g, '_');
        const filePath = path.join(outputDir, `${placasSanitizado}.png`);

        await QRCode.toFile(filePath, unidad.id.toString());
        const qr = await QRCode.toDataURL(unidad.id.toString());

        return { id: unidad.id.toString(), qr, filePath };
      }),
    );

    return resultados;
  }

  private mapToResponse(u: any): UnidadResponseDto {
    return {
      tipoVehiculo: u.tipoVehiculo.tipoVehiculo,
      placas: u.placas,
      volumenCarga: u.volumenCarga,
      numEjes: u.numEjes,
      numLlantas: u.numLlantas,
      fechaAlta: u.fechaAlta,
      tarjetaCirculacion: u.tarjetaCirculacion,
      conductor: u.conductor ? u.conductor.curp : 'S/C',
      claveOficina: u.oficina.clave_cuo,
      estado: u.estado,
      zonaAsignada: u.zonaAsignada,
    };
  }

  async findOne(id: number) {
    const unidad = await this.prisma.unidad.findUnique({
      where: { id },
      include: { asignada: true, oficina: true },
    });
    if (!unidad) {
      throw new NotFoundException(`Unidad con ID ${id} no encontrada`);
    }
    return unidad;
  }
}
