import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConductorResponseDto } from './dto/conductor-response.dto';
import { CreateConductorDto } from './dto/create-conductor.dto';
import { UpdateDisponibilidadDto } from './dto/update-disponibilidad.dto';
import { UpdateLicenciaVigenteDto } from './dto/update-licencia-vigente.dto';

@Injectable()
export class ConductoresService {
  constructor(private prisma: PrismaService) {}

  private mapToResponseDto(conductor: any): ConductorResponseDto {
    return {
      //informacion que aparecera
      nombreCompleto: conductor.nombreCompleto,
      CURP: conductor.curp,
      RFC: conductor.rfc,
      licencia: conductor.licencia,
      telefono: conductor.telefono,
      correo: conductor.correo,
      sucursal: conductor.oficina?.clave_cuo,
      disponibilidad: conductor.disponibilidad,
      licenciaVigente: conductor.licenciaVigente,
    };
  }

  async findAll(): Promise<ConductorResponseDto[]> {
    const conductores = await this.prisma.conductor.findMany({
      include: { oficina: true },
    });
    return conductores.map(this.mapToResponseDto);
  }

  async findAllDisponibles(): Promise<ConductorResponseDto[]> {
    const conductores = await this.prisma.conductor.findMany({
      where: {
        disponibilidad: true,
        licenciaVigente: true,
      },
      include: { oficina: true },
    });
    return conductores.map(this.mapToResponseDto);
  }

  async findAllNoDisponibles(): Promise<ConductorResponseDto[]> {
    const conductores = await this.prisma.conductor.findMany({
      where: {
        disponibilidad: false,
      },
      include: { oficina: true },
    });
    return conductores.map(this.mapToResponseDto);
  }

  async findBySucursal(
    claveUnicaOficina: string,
  ): Promise<ConductorResponseDto[]> {
    const conductores = await this.prisma.conductor.findMany({
      where: { oficina: { clave_cuo: claveUnicaOficina } },
      include: { oficina: true },
      orderBy: { disponibilidad: 'desc' },
    });

    return conductores.map(this.mapToResponseDto);
  }

  async create(createConductorDto: CreateConductorDto) {
    return this.prisma.conductor.create({
      data: {
        ...createConductorDto,
        fechaAlta: new Date(),
        disponibilidad: true,
      },
    });
  }

  async updateDisponibilidad(
    curp: string,
    updateDisponibilidadDto: UpdateDisponibilidadDto,
  ) {
    const conductor = await this.prisma.conductor.findUnique({
      where: { curp },
    });
    if (!conductor) {
      throw new NotFoundException(`Conductor con CURP ${curp} no encontrado`);
    }

    return this.prisma.conductor.update({
      where: { curp },
      data: { disponibilidad: updateDisponibilidadDto.disponibilidad },
    });
  }

  async updateLicenciaVigente(curp: string, dto: UpdateLicenciaVigenteDto) {
    const conductor = await this.prisma.conductor.findUnique({
      where: { curp },
    });
    if (!conductor) {
      throw new NotFoundException(`Conductor con CURP ${curp} no encontrado`);
    }

    return this.prisma.conductor.update({
      where: { curp },
      data: { licenciaVigente: dto.licenciaVigente },
    });
  }

  async deleteByCurp(curp: string): Promise<void> {
    try {
      await this.prisma.conductor.delete({ where: { curp } });
    } catch (error) {
      throw new NotFoundException(`Conductor con CURP ${curp} no encontrado`);
    }
  }
}
