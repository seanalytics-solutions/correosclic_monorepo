import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

import {
  CreateShippingRateDto,
  UpdateShippingRateDto,
  ShippingRateResponseDto,
} from './dto/create-shipping_rate.dto';

@Injectable()
export class ShippingRateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getInternationalTariff(paisDestino: string, peso: number) {
    const country = await this.prisma.internationalCountry.findUnique({
      where: { name: paisDestino },
      include: { zone: true },
    });

    if (!country || !country.zone) {
      throw new NotFoundException('País o zona no encontrada');
    }

    const tarifa = await this.prisma.internationalTariff.findFirst({
      where: {
        zoneId: country.zone.id,
        maxKg: { gte: peso },
      },
      orderBy: { maxKg: 'asc' },
    });

    if (!tarifa) {
      throw new NotFoundException('No se encontró tarifa para ese peso');
    }

    const excedente = peso - (tarifa.maxKg || 0);
    const additionalPerKg = tarifa.additionalPerKg || 0;
    const basePrice = tarifa.basePrice || 0;
    const ivaPercent = tarifa.ivaPercent || 0;

    const adicional =
      excedente > 0 && additionalPerKg
        ? excedente * additionalPerKg
        : 0;
    const subtotal = basePrice + adicional;
    const iva = subtotal * (ivaPercent / 100);
    const total = subtotal + iva;

    return {
      zona: country.zone.code,
      descripcionZona: country.zone.description,
      peso,
      precioBase: basePrice,
      adicional: +adicional.toFixed(2),
      iva: +iva.toFixed(2),
      total: +total.toFixed(2),
    };
  }

  async create(
    createShippingRateDto: CreateShippingRateDto,
  ): Promise<ShippingRateResponseDto> {
    const { zoneId, serviceId, ...rest } = createShippingRateDto as any;
    
    const data: any = { ...rest };
    if ((createShippingRateDto as any).zone) {
        data.zone = { connect: { id: (createShippingRateDto as any).zone.id } };
    } else if (zoneId) {
        data.zone = { connect: { id: zoneId } };
    }

    if ((createShippingRateDto as any).service) {
        data.service = { connect: { id: (createShippingRateDto as any).service.id } };
    } else if (serviceId) {
        data.service = { connect: { id: serviceId } };
    }

    const savedRate = await this.prisma.shippingRate.create({
      data: data,
      include: { zone: true, service: true },
    });
    return this.mapToResponseDto(savedRate);
  }

  async createMany(
    createShippingRateDtos: CreateShippingRateDto[],
  ): Promise<ShippingRateResponseDto[]> {
    const results: ShippingRateResponseDto[] = [];
    for (const dto of createShippingRateDtos) {
        results.push(await this.create(dto));
    }
    return results;
  }

  async findAll(): Promise<ShippingRateResponseDto[]> {
    const rates = await this.prisma.shippingRate.findMany({
      include: { zone: true, service: true },
      orderBy: { id: 'asc' },
    });
    return rates.map((rate) => this.mapToResponseDto(rate));
  }

  async findOne(id: number): Promise<ShippingRateResponseDto> {
    const rate = await this.prisma.shippingRate.findUnique({
      where: { id },
      include: { zone: true, service: true },
    });

    if (!rate) {
      throw new NotFoundException(`Shipping rate with ID ${id} not found`);
    }

    return this.mapToResponseDto(rate);
  }

  async update(
    id: number,
    updateShippingRateDto: UpdateShippingRateDto,
  ): Promise<ShippingRateResponseDto> {
    const rate = await this.prisma.shippingRate.findUnique({ where: { id } });

    if (!rate) {
      throw new NotFoundException(`Shipping rate with ID ${id} not found`);
    }

    const { zoneId, serviceId, ...rest } = updateShippingRateDto as any;
    const data: any = { ...rest };

    if ((updateShippingRateDto as any).zone) {
        data.zone = { connect: { id: (updateShippingRateDto as any).zone.id } };
    } else if (zoneId) {
        data.zone = { connect: { id: zoneId } };
    }

    if ((updateShippingRateDto as any).service) {
        data.service = { connect: { id: (updateShippingRateDto as any).service.id } };
    } else if (serviceId) {
        data.service = { connect: { id: serviceId } };
    }

    const updatedRate = await this.prisma.shippingRate.update({
      where: { id },
      data,
      include: { zone: true, service: true },
    });
    return this.mapToResponseDto(updatedRate);
  }

  async remove(id: number): Promise<void> {
    try {
        await this.prisma.shippingRate.delete({ where: { id } });
    } catch (error) {
        throw new NotFoundException(`Shipping rate with ID ${id} not found`);
    }
  }

  async findZoneByDistance(distanceKm: number) {
    return this.prisma.zone.findFirst({
      where: {
        minDistance: { lte: distanceKm },
        maxDistance: { gte: distanceKm },
      },
    });
  }

  async findShippingRateByZoneAndWeight(
    zoneId: number,
    weight: number,
    serviceId: number,
  ) {
    const rate = await this.prisma.shippingRate.findFirst({
      where: {
        zoneId: zoneId,
        serviceId: serviceId,
        kgMin: { lte: weight },
        kgMax: { gte: weight },
      },
      include: { zone: true, service: true },
    });

    if (!rate) {
      throw new NotFoundException(
        `No shipping rate found for zone ${zoneId}, service ${serviceId}, and weight ${weight}kg`,
      );
    }

    return rate;
  }

  async findTarifa(
    zonaId: number,
    servicioId: number,
    peso: number,
  ) {
    return await this.prisma.shippingRate.findFirst({
      where: {
        zoneId: zonaId,
        serviceId: servicioId,
        kgMin: { lte: peso },
        kgMax: { gte: peso },
      },
    });
  }

  async getDatosZonaYDistancia(
    codigoOrigen: string,
    codigoDestino: string,
  ): Promise<{
    distanciaKm: number;
    zona: any;
    ciudadOrigen: string;
    ciudadDestino: string;
  }> {
    const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');

    const getCoords = async (cp: string) => {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${cp},MX&key=${apiKey}`;
      const res = await firstValueFrom(this.httpService.get(url));
      const location = res.data.results?.[0]?.geometry?.location;
      if (!location)
        throw new NotFoundException(`No se pudo geocodificar el CP: ${cp}`);
      return location;
    };

    const origen = await getCoords(codigoOrigen);
    const destino = await getCoords(codigoDestino);

    const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origen.lat},${origen.lng}&destinations=${destino.lat},${destino.lng}&mode=driving&language=es&key=${apiKey}`;
    const distanceRes = await firstValueFrom(this.httpService.get(distanceUrl));
    const element = distanceRes.data.rows?.[0]?.elements?.[0];

    if (element?.status !== 'OK') {
      throw new NotFoundException(
        'No se pudo calcular la distancia entre los CP',
      );
    }

    const distanciaKm = Math.ceil(element.distance.value / 1000);
    const zona = await this.findZoneByDistance(distanciaKm);

    if (!zona) {
      throw new NotFoundException(`No se encontró zona para ${distanciaKm} km`);
    }

    return {
      distanciaKm,
      zona,
      ciudadOrigen: distanceRes.data.origin_addresses?.[0] ?? '',
      ciudadDestino: distanceRes.data.destination_addresses?.[0] ?? '',
    };
  }

  private mapToResponseDto(rate: any): ShippingRateResponseDto {
    return {
      id: rate.id,
      kgMin: rate.kgMin,
      kgMax: rate.kgMax,
      price: rate.price,
      zone: {
        id: rate.zone.id,
        name: rate.zone.zoneName,
        minDistance: rate.zone.minDistance,
        maxDistance: rate.zone.maxDistance,
      },
      service: {
        id: rate.service.id,
        name: rate.service.serviceName,
      },
    };
  }

  async getAllInternationalCountries() {
    return await this.prisma.internationalCountry.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getInternationalTariffByVolumetric(payload: {
    paisDestino: string;
    peso: number;
    largo: number;
    ancho: number;
    alto: number;
  }) {
    const { paisDestino, peso, largo, ancho, alto } = payload;

    const country = await this.prisma.internationalCountry.findUnique({
      where: { name: paisDestino },
      include: { zone: true },
    });

    if (!country || !country.zone) {
      throw new NotFoundException('País o zona no encontrada');
    }

    const pesoVol = +((largo * alto * ancho) / 5000).toFixed(2);
    const pesoFacturable = Math.max(peso, pesoVol);

    const tarifa = await this.prisma.internationalTariff.findFirst({
      where: {
        zoneId: country.zone.id,
        maxKg: { gte: pesoFacturable },
      },
      orderBy: { maxKg: 'asc' },
    });

    if (!tarifa) {
      throw new NotFoundException('No se encontró tarifa para ese peso');
    }

    const basePrice = tarifa.basePrice || 0;
    const ivaPercent = tarifa.ivaPercent || 0;

    const adicional = 0;
    const subtotal = basePrice + adicional;
    const iva = +(subtotal * (ivaPercent / 100)).toFixed(2);
    const total = +(subtotal + iva).toFixed(2);

    return {
      zona: country.zone.code,
      descripcionZona: country.zone.description,
      pesoFisico: peso,
      pesoVolumetrico: pesoVol,
      pesoCobrado: pesoFacturable,
      precioBase: basePrice,
      iva,
      total,
    };
  }

  async findCountryInfo(paisDestino: string) {
    const country = await this.prisma.internationalCountry.findUnique({
      where: { name: paisDestino },
      include: { zone: true },
    });

    if (!country) {
      throw new NotFoundException('País no encontrado');
    }

    return {
      pais: country.name,
      zona: country.zone?.code,
      descripcionZona: country.zone?.description,
    };
  }
}
