import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
  constructor(private prisma: PrismaService) {}

  // Crear factura tras pago
  async crearDesdePago(opts: {
    profileId: number;
    totalMXN: number; // en MXN
    status: string; // 'PAGADA' | 'CREADA' | etc.
    productos?: string[]; // ['Producto x2', 'Envío Estándar']
  }) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: opts.profileId },
    });
    if (!profile) throw new NotFoundException('Perfil no encontrado');

    const consecutivo = await this.prisma.factura.count();
    const numeroFactura = `F-${new Date().getFullYear()}-${String(consecutivo + 1).padStart(6, '0')}`;

    const factura = await this.prisma.factura.create({
      data: {
        numero_factura: numeroFactura,
        precio: opts.totalMXN, // ajusta al nombre de tu columna
        status: opts.status,
        productos: (opts.productos ?? ['Compra en Correos MX']).join(','),
        fecha_creacion: new Date(),
        fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sucursal: 'Correos Clic',
        profileId: opts.profileId,
      },
    });

    return this.mapFactura(factura);
  }

  // Listados (útiles para probar)
  async findAll() {
    const facturas = await this.prisma.factura.findMany({
      orderBy: { fecha_creacion: 'desc' },
    });
    return facturas.map((f) => this.mapFactura(f));
  }

  async findByProfile(profileId: number) {
    const facturas = await this.prisma.factura.findMany({
      where: { profileId },
      orderBy: { fecha_creacion: 'desc' },
    });
    return facturas.map((f) => this.mapFactura(f));
  }

  async findByBillingId(billingId: number) {
    const factura = await this.prisma.factura.findUnique({
      where: { id: billingId },
    });
    return factura ? this.mapFactura(factura) : null;
  }

  async findByFilters(filters: FacturaFilters) {
    const where: any = {};

    if (filters.id) where.id = filters.id;
    if (filters.profileId) where.profileId = filters.profileId;
    if (filters.numero_factura)
      where.numero_factura = { contains: filters.numero_factura };
    if (filters.sucursal) where.sucursal = { contains: filters.sucursal };
    if (filters.status) where.status = filters.status;

    // Precio
    if (filters.precio) {
      where.precio = filters.precio;
    } else if (filters.precioMin || filters.precioMax) {
      where.precio = {};
      if (filters.precioMin) where.precio.gte = filters.precioMin;
      if (filters.precioMax) where.precio.lte = filters.precioMax;
    }

    // Fecha creación
    if (filters.fecha_creacion) {
      where.fecha_creacion = filters.fecha_creacion;
    } else if (filters.fecha_creacionDesde || filters.fecha_creacionHasta) {
      where.fecha_creacion = {};
      if (filters.fecha_creacionDesde)
        where.fecha_creacion.gte = filters.fecha_creacionDesde;
      if (filters.fecha_creacionHasta)
        where.fecha_creacion.lte = filters.fecha_creacionHasta;
    }

    // Fecha vencimiento
    if (filters.fecha_vencimiento) {
      where.fecha_vencimiento = filters.fecha_vencimiento;
    } else if (
      filters.fecha_vencimientoDesde ||
      filters.fecha_vencimientoHasta
    ) {
      where.fecha_vencimiento = {};
      if (filters.fecha_vencimientoDesde)
        where.fecha_vencimiento.gte = filters.fecha_vencimientoDesde;
      if (filters.fecha_vencimientoHasta)
        where.fecha_vencimiento.lte = filters.fecha_vencimientoHasta;
    }

    const facturas = await this.prisma.factura.findMany({
      where,
      orderBy: { fecha_creacion: 'desc' },
    });
    return facturas.map((f) => this.mapFactura(f));
  }

  private mapFactura(f: any) {
    return {
      ...f,
      productos: f.productos ? f.productos.split(',') : [],
    };
  }
}
