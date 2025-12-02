import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OficinasService {
  constructor(private readonly prisma: PrismaService) {}

  // Método unificado de búsqueda optimizado
  async buscarOficinas(termino: string) {
    try {
      const terminoLimpio = termino.trim();

      if (!terminoLimpio) {
        return [];
      }

      let where: any = { activo: true };

      // Detectar si es código postal (5 dígitos)
      if (/^\d{5}$/.test(terminoLimpio)) {
        where.codigo_postal = terminoLimpio;
      } else {
        // Buscar por nombre de entidad o municipio
        where.OR = [
          { nombre_entidad: { contains: terminoLimpio, mode: 'insensitive' } },
          { nombre_municipio: { contains: terminoLimpio, mode: 'insensitive' } },
        ];
      }

      // Obtener todas las oficinas que coincidan
      const todasLasOficinas = await this.prisma.oficina.findMany({
        where,
        orderBy: { id_oficina: 'asc' },
      });

      // DEDUPLICACIÓN MANUAL: Eliminar duplicados por domicilio
      const oficinasSinDuplicados: typeof todasLasOficinas = [];

      const domiciliosVistos = new Set();

      for (const oficina of todasLasOficinas) {
        // Normalizar domicilio para comparación (sin espacios extra, mayúsculas)
        const domicilioNormalizado = oficina.domicilio
          .toLowerCase()
          .replace(/\s+/g, ' ')
          .trim();

        if (!domiciliosVistos.has(domicilioNormalizado)) {
          domiciliosVistos.add(domicilioNormalizado);
          oficinasSinDuplicados.push(oficina);
        }
      }

      return oficinasSinDuplicados; // Siempre devuelve array (vacío si no encuentra)
    } catch (error) {
      console.error('Error en buscarOficinas:', error);
      return []; // Devuelve array vacío en lugar de lanzar excepción
    }
  }

  // Métodos específicos (mantener por compatibilidad si es necesario)
  async findByCodigoPostal(codigo_postal: string) {
    return this.buscarOficinas(codigo_postal);
  }

  async findByNombreEntidad(nombre_entidad: string) {
    return this.buscarOficinas(nombre_entidad);
  }

  async findByNombreMunicipio(nombre_municipio: string) {
    return this.buscarOficinas(nombre_municipio);
  }
}
