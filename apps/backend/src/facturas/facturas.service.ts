import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Like,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { Factura } from './factura.entity';
import { Profile } from '../profile/entities/profile.entity';

export interface FacturaFilters {
  id?: number;
  profileId?: number;
  numero_factura?: string;
  precio?: number;
  precioMin?: number;
  precioMax?: number;
  sucursal?: string;
  status?: string;
  fecha_creacion?: Date;
  fecha_creacionDesde?: Date;
  fecha_creacionHasta?: Date;
  fecha_vencimiento?: Date;
  fecha_vencimientoDesde?: Date;
  fecha_vencimientoHasta?: Date;
}

@Injectable()
export class FacturasService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepo: Repository<Factura>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) {}

  // Crear factura tras pago
  async crearDesdePago(opts: {
    profileId: number;
    totalMXN: number; // en MXN
    status: string; // 'PAGADA' | 'CREADA' | etc.
    productos?: string[]; // ['Producto x2', 'Envío Estándar']
  }): Promise<Factura> {
    const profile = await this.profileRepo.findOne({
      where: { id: opts.profileId },
    });
    if (!profile) throw new NotFoundException('Perfil no encontrado');

    const consecutivo = await this.facturaRepo.count();
    const numeroFactura = `F-${new Date().getFullYear()}-${String(consecutivo + 1).padStart(6, '0')}`;

    const factura = this.facturaRepo.create({
      numero_factura: numeroFactura,
      precio: opts.totalMXN, // ajusta al nombre de tu columna
      status: opts.status,
      productos: opts.productos ?? ['Compra en Correos MX'],
      fecha_creacion: new Date(),
      fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      sucursal: 'Correos Clic',
      profile,
    });

    return this.facturaRepo.save(factura);
  }

  // Listados (útiles para probar)
  findAll() {
    return this.facturaRepo.find({ order: { fecha_creacion: 'DESC' } });
  }

  findByProfile(profileId: number) {
    return this.facturaRepo.find({
      where: { profile: { id: profileId } },
      order: { fecha_creacion: 'DESC' },
    });
  }

  findByBillingId(billingId: number) {
    return this.facturaRepo.findOne({
      where: { id: billingId },
    });
  }

  findByFilters(filters: FacturaFilters): Promise<Factura[]> {
    const where: Record<string, unknown> = {};

    if (filters.id) where.id = filters.id;
    if (filters.profileId) where.profile = { id: filters.profileId };
    if (filters.numero_factura)
      where.numero_factura = Like(`%${filters.numero_factura}%`);
    if (filters.sucursal) where.sucursal = Like(`%${filters.sucursal}%`);
    if (filters.status) where.status = filters.status;

    // Precio
    if (filters.precio) {
      where.precio = filters.precio;
    } else if (filters.precioMin && filters.precioMax) {
      where.precio = Between(filters.precioMin, filters.precioMax);
    } else if (filters.precioMin) {
      where.precio = MoreThanOrEqual(filters.precioMin);
    } else if (filters.precioMax) {
      where.precio = LessThanOrEqual(filters.precioMax);
    }

    // Fecha creación
    if (filters.fecha_creacion) {
      where.fecha_creacion = filters.fecha_creacion;
    } else if (filters.fecha_creacionDesde && filters.fecha_creacionHasta) {
      where.fecha_creacion = Between(
        filters.fecha_creacionDesde,
        filters.fecha_creacionHasta,
      );
    } else if (filters.fecha_creacionDesde) {
      where.fecha_creacion = MoreThanOrEqual(filters.fecha_creacionDesde);
    } else if (filters.fecha_creacionHasta) {
      where.fecha_creacion = LessThanOrEqual(filters.fecha_creacionHasta);
    }

    // Fecha vencimiento
    if (filters.fecha_vencimiento) {
      where.fecha_vencimiento = filters.fecha_vencimiento;
    } else if (
      filters.fecha_vencimientoDesde &&
      filters.fecha_vencimientoHasta
    ) {
      where.fecha_vencimiento = Between(
        filters.fecha_vencimientoDesde,
        filters.fecha_vencimientoHasta,
      );
    } else if (filters.fecha_vencimientoDesde) {
      where.fecha_vencimiento = MoreThanOrEqual(filters.fecha_vencimientoDesde);
    } else if (filters.fecha_vencimientoHasta) {
      where.fecha_vencimiento = LessThanOrEqual(filters.fecha_vencimientoHasta);
    }

    return this.facturaRepo.find({
      where,
      order: { fecha_creacion: 'DESC' },
    });
  }
}
