import { Module } from '@nestjs/common';
import { ClerkService } from './clerk.service';
import { ClerkController } from './clerk.controller';
import { CreateAccountModule } from '../create-account/create-account.module';
import { EmailModule } from '../enviar-correos/enviar-correos.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    CreateAccountModule,
    EmailModule,
  ],
  controllers: [ClerkController],
  providers: [ClerkService],
})
export class ClerkModule {}
