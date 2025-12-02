import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    // Note: Ensure createProfileDto has all required fields for Prisma
    await this.prisma.profile.create({
      data: createProfileDto as any,
    });
    return { message: 'Perfil creado correctamente' };
  }

  async findAll() {
    return this.prisma.profile.findMany({
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const perfil = await this.prisma.profile.findUnique({ where: { id } });

    if (!perfil) {
      throw new NotFoundException('El perfil no existe');
    }

    const DEFAULT_IMAGE = `${process.env.BASE_URL}/uploads/defaults/avatar-default.png`;

    if (!perfil.imagen || perfil.imagen.trim() === '') {
      perfil.imagen = DEFAULT_IMAGE;
    }

    return perfil;
  }

  async update(id: number, dto: UpdateProfileDto) {
    await this.prisma.profile.update({
      where: { id },
      data: dto,
    });
    return { ok: true, message: 'Perfil actualizado correctamente' };
  }

  async remove(id: number) {
    await this.prisma.profile.delete({ where: { id } });
    return { message: 'Perfil eliminado correctamente' };
  }

  async save(profile: Profile): Promise<Profile> {
    if (profile.id) {
      return this.prisma.profile.update({
        where: { id: profile.id },
        data: profile,
      });
    } else {
      return this.prisma.profile.create({
        data: profile as any,
      });
    }
  }

  async updateAvatar(id: number, url: string): Promise<Profile> {
    return this.prisma.profile.update({
      where: { id },
      data: { imagen: url },
    });
  }
}
