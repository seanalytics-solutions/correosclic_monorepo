import { Module } from '@nestjs/common';
import { CreateAccountService } from './create-account.service';
import { CreateAccountController } from './create-account.controller';
import { EnviarCorreosService } from '../enviar-correos/enviar-correos.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CreateAccountController],
  providers: [CreateAccountService, EnviarCorreosService],
})
export class CreateAccountModule {}
