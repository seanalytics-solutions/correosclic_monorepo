import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SolicitudDto } from './dto/solicitud.dto';
import {
  PedidoAsignadoDto,
  ClienteInfoDto,
  ProductoPedidoDto,
} from './dto/pedidos-asignados.dto';

@Injectable()
export class VendedorService {
  constructor(private prisma: PrismaService) {}

  async crearSolicitud(solicitud: SolicitudDto) {
    console.log('📝 Creando solicitud:', solicitud);

    const resultado = await this.prisma.solicitudVendedor.create({
      data: {
        ...solicitud,
        userId: Number(solicitud.userId),
      },
    });
    console.log('✅ Solicitud creada:', resultado);

    return resultado;
  }

  async encontrarPorUserId(userId: string) {
    return this.prisma.solicitudVendedor.findFirst({
      where: { userId: Number(userId) },
    });
  }

  async obtenerPedidosAsignados(
    profileId: number,
  ): Promise<PedidoAsignadoDto[]> {
    console.log('🔍 Obteniendo pedidos para profileId:', profileId);

    const pedidos = await this.prisma.pedido.findMany({
      where: {
        status: { not: 'pendiente' },
        productos: {
          some: {
            producto: {
              idPerfil: profileId
            }
          }
        }
      },
      include: {
        productos: {
          include: {
            producto: true
          }
        }
      },
      orderBy: { fecha: 'desc' }
    });

    console.log('📦 Pedidos encontrados:', pedidos.length);

    const pedidosAsignados: PedidoAsignadoDto[] = [];

    const primeraGuia = await this.prisma.guia.findFirst({
      include: { destinatario: true },
      orderBy: { fecha_creacion: 'asc' }
    });

    for (const pedido of pedidos) {
      const productosVendedor = pedido.productos.filter(
        (pp) => pp.producto.idPerfil === profileId,
      );

      if (productosVendedor.length === 0) continue;

      let clienteInfo: ClienteInfoDto = {
        nombre: 'Cliente no identificado',
        direccion: 'Dirección no disponible',
      };

      if (primeraGuia && primeraGuia.destinatario) {
        const contacto = primeraGuia.destinatario;
        clienteInfo = {
          nombre: `${contacto.nombres} ${contacto.apellidos}`,
          direccion: this.formatearDireccion(contacto),
        };
      }

      const productos: ProductoPedidoDto[] = productosVendedor.map((pp) => ({
        sku: pp.producto.sku,
        nombre: pp.producto.nombre,
        cantidad: pp.cantidad,
        estado: primeraGuia?.situacion_actual || 'Sin información',
      }));

      pedidosAsignados.push({
        id: pedido.id,
        fecha: pedido.fecha.toISOString().split('T')[0],
        cliente: clienteInfo,
        productos,
      });
    }

    console.log('✅ Pedidos asignados procesados:', pedidosAsignados.length);
    return pedidosAsignados;
  }

  private formatearDireccion(contacto: any): string {
    const partes = [
      contacto.calle,
      contacto.numero,
      contacto.numero_interior,
      contacto.asentamiento,
      contacto.codigo_postal,
      contacto.localidad,
      contacto.estado,
      contacto.pais,
    ].filter((parte) => parte && parte.trim() !== '');

    return partes.join(', ');
  }
}
