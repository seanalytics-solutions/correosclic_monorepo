import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccount, Profile } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(data: Partial<CreateAccount> & { profile?: any }) {
    const { profile, ...userData } = data;
    
    // Prepare profile data if it exists
    let profileCreateData: any = undefined;
    if (profile) {
      // If profile is a TypeORM entity or object, we extract properties.
      // We assume it matches ProfileCreateInput roughly.
      // We exclude 'id' if it's present and falsy/0/undefined to let DB generate it, 
      // or if it's auto-increment.
      const { id, ...restProfile } = profile;
      profileCreateData = {
        create: restProfile
      };
    }

    const user = await this.prisma.createAccount.create({
      data: {
        ...userData as any,
        tokenCreatedAt: new Date(),
        profile: profileCreateData,
      },
      include: {
        profile: true,
      },
    });
    return user;
  }

  findAll() {
    return this.prisma.createAccount.findMany();
  }

  findByCorreo(correo: string) {
    return this.prisma.createAccount.findFirst({
      where: { correo },
      include: { profile: true },
    });
  }

  findByCorreoNoOAuth(correo: string) {
    return this.prisma.createAccount.findFirst({
      where: {
        correo,
        password: { not: 'N/A: OAuth' },
      },
    });
  }

  findById(id: number) {
    return this.prisma.createAccount.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  async update(email: string, password: string) {
    const result = await this.prisma.createAccount.updateMany({
      where: {
        correo: email,
        password: { not: 'N/A: OAuth' },
      },
      data: { password, confirmado: true },
    });

    if (result.count === 0) {
      this.logger.warn(`No se encontró usuario para actualizar: ${email}`);
    }
    return { affected: result.count };
  }

  async updateOTP(
    email: string,
    data: {
      token?: string | null;
      tokenCreatedAt?: Date | null;
      confirmado?: boolean;
    },
  ) {
    try {
      const result = await this.prisma.createAccount.updateMany({
        where: {
          correo: email,
          password: { not: 'N/A: OAuth' },
        },
        data: {
          token: data.token,
          tokenCreatedAt: data.tokenCreatedAt,
          confirmado: data.confirmado,
        },
      });

      if (result.count === 0) {
        this.logger.warn(`No se pudo actualizar OTP para: ${email}`);
      }
      return { affected: result.count };
    } catch (error) {
      this.logger.error(`Error al actualizar OTP: ${error.message}`);
      throw error;
    }
  }

  async updateConfirmado(email: string, confirmado: boolean) {
    const result = await this.prisma.createAccount.updateMany({
      where: {
        correo: email,
        password: { not: 'N/A: OAuth' },
      },
      data: { confirmado },
    });

    if (result.count === 0) {
      this.logger.warn(
        `No se pudo actualizar estado de confirmación para: ${email}`,
      );
    }
    return { affected: result.count };
  }

  async cleanExpiredTokens(): Promise<number> {
    try {
      const expirationTime = new Date(Date.now() + (360 - 10) * 60 * 1000); // 10 minutos atrás (compensación de UTC -6)
      const result = await this.prisma.createAccount.updateMany({
        where: {
          tokenCreatedAt: { lt: expirationTime },
          token: { not: null },
        },
        data: {
          token: null,
          tokenCreatedAt: null,
        },
      });

      const cleanedCount = result.count;
      this.logger.log(`Tokens expirados limpiados: ${cleanedCount}`);
      return cleanedCount;
    } catch (error) {
      this.logger.error(`Error limpiando tokens expirados: ${error.message}`);
      throw error;
    }
  }

  async cleanUnverifiedUsers(): Promise<number> {
    try {
      const expirationTime = new Date(Date.now() - 18 * 60 * 60 * 1000); // 24 horas (compensación de UTC -6)

      const result = await this.prisma.createAccount.deleteMany({
        where: {
          confirmado: false,
          tokenCreatedAt: { lt: expirationTime, not: null },
        },
      });

      const deletedCount = result.count;
      this.logger.log(`Usuarios no verificados eliminados: ${deletedCount}`);
      return deletedCount;
    } catch (error) {
      this.logger.error(
        `Error limpiando usuarios no verificados: ${error.message}`,
      );
      throw error;
    }
  }

  async findUnverifiedUsers(expirationTime: Date) {
    return this.prisma.createAccount.findMany({
      where: {
        confirmado: false,
        tokenCreatedAt: { lt: expirationTime },
      },
    });
  }
}
