import { Module } from '@nestjs/common';
import { ShippingRateService } from './shipping_rates.service';
import { ShippingRateController } from './shipping_rates.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
  ],
  controllers: [ShippingRateController],
  providers: [ShippingRateService],
})
export class ShippingRateModule {}
