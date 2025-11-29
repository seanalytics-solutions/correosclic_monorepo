import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EnviarCorreosService } from '../enviar-correos/enviar-correos.service';
import { generateToken } from '../utils/token';
import { CompleteNameDto } from './dto/comple-name.dto';
import { CompletePasswordDto } from './dto/complete-password.dto';
import { CreateCreateAccountDto } from './dto/create-create-account.dto';
import { UpdateCreateAccountDto } from './dto/update-create-account.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CreateAccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EnviarCorreosService,
  ) {}
  async create(createCreateAccountDto: CreateCreateAccountDto) {
    const token = generateToken();
    const user = await this.prisma.createAccount.create({
      data: {
        ...createCreateAccountDto,
        token,
        confirmado: false,
      },
    });

    await this.emailService.enviarConfirmacion({
      correo: createCreateAccountDto.correo,
      token,
    });
    return {
      message:
        'Se ha enviado un codigo de verificacion, por favor de checar tu email',
      ok: true,
    };
  }

  findAll() {
    return `This action returns all createAccount`;
  }

  findOne(id: number) {
    return `This action returns a #${id} createAccount`;
  }

  update(id: number, updateCreateAccountDto: UpdateCreateAccountDto) {
    return `This action updates a #${id} createAccount`;
  }

  remove(id: number) {
    return `This action removes a #${id} createAccount`;
  }

  async checkCoupon(token: string) {
    // Me aseguro de que el token no llegue vacío o nulo.
    if (!token) {
      throw new BadRequestException('Token no puede estar vacío');
    }

    const user = await this.prisma.createAccount.findFirst({
      where: { token },
    });

    if (!user) {
      throw new NotFoundException('Token no valido');
    }

    await this.prisma.createAccount.update({
      where: { id: user.id },
      data: {
        token: '',
        confirmado: true,
      },
    });

    return {
      message: 'Token confirmado correctamente',
      id: user.id,
      ok: true,
    };
  }
  async completeName(id: number, completeNameAccountDto: CompleteNameDto) {
    const user = await this.prisma.createAccount.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Chequeo de seguridad
    if (!user.confirmado) {
      throw new UnauthorizedException('La cuenta no ha sido verificada');
    }

    await this.prisma.createAccount.update({
      where: { id },
      data: {
        nombre: completeNameAccountDto.nombre,
        apellido: completeNameAccountDto.apellido,
      },
    });

    return {
      message: 'Nombre y apellido completado correctamente',
      id: user.id,
      ok: true,
    };
  }
  async completePassword(
    id: number,
    completePasswordAccountDto: CompletePasswordDto,
  ) {
    const user = await this.prisma.createAccount.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Chequeo de seguridad
    if (!user.confirmado) {
      throw new UnauthorizedException('La cuenta no ha sido verificada');
    }

    await this.prisma.createAccount.update({
      where: { id },
      data: {
        password: completePasswordAccountDto.password,
      },
    });

    return {
      message: 'Registro completado correctamente',
      id: user.id,
      ok: true,
    };
  }
}
