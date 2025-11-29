import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StripeService {
  private stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY ??
      (() => {
        throw new Error('STRIPE_SECRET_KEY no definida');
      })(),
    {
      apiVersion: '2025-08-27.basil',
    },
  );

  constructor(private readonly prisma: PrismaService) {}

  async createCustomer(email: string) {
    return await this.stripe.customers.create({ email });
  }

  async attachPaymentMethod(customerId: string, paymentMethodId: string) {
    await this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    await this.stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
  }

  async createPaymentIntent(
    amount: number,
    customerId: string,
    paymentMethodId: string,
  ) {
    return await this.stripe.paymentIntents.create({
      amount,
      currency: 'mxn',
      customer: customerId,
      payment_method: paymentMethodId,
      payment_method_types: ['card'],
      confirm: true,
    });
  }

  async saveCardToDatabase(
    paymentMethod: Stripe.PaymentMethod,
    profileId: number,
  ) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });
    if (!profile) throw new Error('Perfil no encontrado');

    return await this.prisma.card.create({
      data: {
        stripeCardId: paymentMethod.id,
        last4: paymentMethod.card?.last4 ?? '',
        brand: paymentMethod.card?.brand ?? '',
        profileId: profileId,
      },
    });
  }

  async associateCardAndSave(
    customerId: string,
    paymentMethodId: string,
    profileId: number,
  ) {
    // 1. Asociar tarjeta al cliente en Stripe
    await this.attachPaymentMethod(customerId, paymentMethodId);

    // 2. Obtener los datos de la tarjeta desde Stripe
    const paymentMethod =
      await this.stripe.paymentMethods.retrieve(paymentMethodId);

    // 3. Guardar en base de datos
    return await this.saveCardToDatabase(paymentMethod, profileId);
  }
}
