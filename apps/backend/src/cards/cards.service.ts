import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CardsService {
  private readonly logger = new Logger(CardsService.name);
  private readonly stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-08-27.basil',
    });
  }

  async getCardsByUser(userId: number) {
    // Buscar el perfil asociado al userId
    const profile = await this.prisma.profile.findUnique({
      where: { usuarioId: userId },
    });
    if (!profile) {
      return [];
    }
    // Buscar las tarjetas por profileId
    return this.prisma.card.findMany({
      where: { profileId: profile.id },
    });
  }

  async addCard(userId: number, token: string) {
    try {
      // Buscar el perfil asociado al userId
      const profile = await this.prisma.profile.findUnique({
        where: { usuarioId: userId },
      });

      if (!profile) {
        throw new NotFoundException('Perfil no encontrado para este usuario');
      }

      // Verificar datos del perfil
      if (!profile.stripeCustomerId) {
        throw new NotFoundException(
          'Stripe Customer ID no encontrado para este perfil',
        );
      }

      this.logger.debug(
        `Agregando tarjeta para Stripe Customer: ${profile.stripeCustomerId}`,
      );

      // Crear la fuente (tarjeta) en Stripe
      const card = (await this.stripe.customers.createSource(
        profile.stripeCustomerId,
        {
          source: token,
        },
      )) as Stripe.Card;

      this.logger.debug(
        `Tarjeta creada en Stripe: ${card.id} (${card.brand}) ****${card.last4}`,
      );

      // Guardar la tarjeta en la base de datos
      const savedCard = await this.prisma.card.create({
        data: {
          stripeCardId: card.id,
          last4: card.last4,
          brand: card.brand,
          profileId: profile.id,
        },
      });

      this.logger.debug(`Tarjeta guardada en DB con ID: ${savedCard.id}`);

      // Devolver la tarjeta guardada
      return savedCard;
    } catch (error) {
      this.logger.error('Error al agregar tarjeta:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('No se pudo agregar la tarjeta');
    }
  }

  async getCards(profileId: number) {
    return this.prisma.card.findMany({ where: { profileId } });
  }
  async findAll() {
    return this.prisma.card.findMany();
  }

  async deleteCardByStripeId(stripeCardId: string, profileId: number) {
    console.log('deleteCardByStripeId:', { stripeCardId, profileId });
    const card = await this.prisma.card.findFirst({
      where: { stripeCardId, profileId },
    });
    console.log('Card encontrada:', card);
    if (!card) return;

    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });
    const stripeCustomerId = profile?.stripeCustomerId;

    console.log('stripeCustomerId:', stripeCustomerId);
    if (stripeCustomerId) {
      let stripeResult;
      if (stripeCardId.startsWith('pm_')) {
        // Es un PaymentMethod
        stripeResult = await this.stripe.paymentMethods.detach(stripeCardId);
        console.log('Detach PaymentMethod:', stripeResult);
      } else {
        // Es un Source (legacy)
        stripeResult = await this.stripe.customers.deleteSource(
          stripeCustomerId,
          stripeCardId,
        );
        console.log('Delete Source:', stripeResult);
      }
    }
    const dbResult = await this.prisma.card.delete({ where: { id: card.id } });
    console.log('Resultado BD:', dbResult);
    return dbResult;
  }
}
