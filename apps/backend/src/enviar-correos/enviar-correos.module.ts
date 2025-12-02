import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnviarCorreosService } from './enviar-correos.service';
import { EnviarCorreosController } from './enviar-correo.controller';

@Module({
  imports: [ConfigModule],
  controllers: [EnviarCorreosController],
  providers: [EnviarCorreosService],
  exports: [EnviarCorreosService],
})
export class EmailModule {}
