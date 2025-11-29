import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UploadImageService } from '../upload-image/upload-image.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadImageService: UploadImageService,
  ) {}

  async create(dto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        productId: dto.productId,
        profileId: dto.profileId,
      },
    });
  }

  // NUEVO: crear con imágenes (multipart)
  async createWithImages(dto: CreateReviewDto, files?: Express.Multer.File[]) {
    const review = await this.create(dto);
    if (files?.length) {
      const imgs = await Promise.all(
        files.map(async (file, idx) => {
          const url = await this.uploadImageService.uploadFileImage(file);
          return this.prisma.reviewImage.create({
            data: {
              url,
              orden: idx,
              reviewId: review.id,
            },
          });
        }),
      );
      (review as any).images = imgs;
    }
    return review;
  }

  // NUEVO: agregar imágenes a una reseña existente
  async addImages(reviewId: number, files: Express.Multer.File[]) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Reseña no encontrada');

    const imgs = await Promise.all(
      files.map(async (file, idx) => {
        const url = await this.uploadImageService.uploadFileImage(file);
        return this.prisma.reviewImage.create({
          data: { url, orden: idx, reviewId },
        });
      }),
    );
    return imgs;
  }

  async findByProduct(productId: number) {
    return this.prisma.review.findMany({
      where: { productId },
      include: { profile: true, images: true }, // 👈 incluye imágenes
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: number) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Reseña no encontrada');
    return this.prisma.review.delete({ where: { id } });
  }

  // NUEVO: borrar una imagen específica
  async removeImage(reviewId: number, imageId: number) {
    const img = await this.prisma.reviewImage.findFirst({
      where: { id: imageId, reviewId },
    });
    if (!img) throw new NotFoundException('Imagen de reseña no encontrada');
    await this.prisma.reviewImage.delete({ where: { id: imageId } });
    return 'Imagen eliminada';
  }
}
