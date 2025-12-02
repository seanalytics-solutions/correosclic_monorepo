import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
    console.log('📝 ========== CREANDO SOLICITUD ==========');
    console.log('📝 Solicitud completa:', JSON.stringify(solicitud, null, 2));
    console.log('📝 userId recibido:', solicitud.userId);
    console.log('📝 Tipo de userId:', typeof solicitud.userId);
    console.log('📝 userId convertido a Number:', Number(solicitud.userId));

    // Verificar si el usuario existe antes de crear
    const usuarioExiste = await this.prisma.usuarios.findUnique({
      where: { id: Number(solicitud.userId) },
    });
    console.log('🔍 ¿Usuario existe?:', usuarioExiste ? 'SÍ' : 'NO');

    if (usuarioExiste) {
      console.log('👤 Usuario encontrado:', {
        id: usuarioExiste.id,
        correo: usuarioExiste.correo,
      });
    } else {
      // Buscar si es un profileId
      const profileExiste = await this.prisma.profile.findUnique({
        where: { id: Number(solicitud.userId) },
        include: { Usuarios: true },
      });
      console.log('🔍 ¿Es un profileId?:', profileExiste ? 'SÍ' : 'NO');
      if (profileExiste) {
        console.log('👤 Profile encontrado:', {
          profileId: profileExiste.id,
          userId: profileExiste.usuarioId,
        });
      }
    }

    const resultado = await this.prisma.solicitudVendedor.create({
      data: {
        ...solicitud,
        userId: Number(solicitud.userId),
      },
    });
    console.log('✅ Solicitud creada:', resultado);
    console.log('📝 ==========================================');

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
              idPerfil: profileId,
            },
          },
        },
      },
      include: {
        productos: {
          include: {
            producto: true,
          },
        },
      },
      orderBy: { fecha: 'desc' },
    });

    console.log('📦 Pedidos encontrados:', pedidos.length);

    const pedidosAsignados: PedidoAsignadoDto[] = [];

    const primeraGuia = await this.prisma.guia.findFirst({
      include: { destinatario: true },
      orderBy: { fecha_creacion: 'asc' },
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
