import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UploadImageService } from '../upload-image/upload-image.service';
import { Product, ProductImage } from '@prisma/client';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadImageService: UploadImageService,
  ) {}

  async createWithImages(
    createProductDto: CreateProductDto,
    files?: Express.Multer.File[],
  ): Promise<Product & { images: ProductImage[] }> {
    const { inventario, ...productData } = createProductDto;

    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          ...productData,
          inventario: inventario || 0,
        },
      });

      let images: ProductImage[] = [];
      if (files?.length) {
        images = await Promise.all(
          files.map(async (file, idx) => {
            const url = await this.uploadImageService.uploadFileImage(file);
            return tx.productImage.create({
              data: {
                url,
                orden: idx,
                productId: product.id,
              },
            });
          }),
        );
      }

      return { ...product, images };
    });
  }

  async addImages(
    productId: number,
    files: Express.Multer.File[],
    ordenes?: number[],
  ): Promise<ProductImage[]> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }

    const maxOrderResult = await this.prisma.productImage.aggregate({
      where: { productId },
      _max: { orden: true },
    });
    const startOrder = (maxOrderResult._max.orden ?? -1) + 1;

    return this.prisma.$transaction(async (tx) => {
      const imgs = await Promise.all(
        files.map(async (file, i) => {
          const url = await this.uploadImageService.uploadFileImage(file);
          return tx.productImage.create({
            data: {
              url,
              orden: ordenes?.[i] ?? startOrder + i,
              productId: productId,
            },
          });
        }),
      );
      return imgs;
    });
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      include: {
        images: true,
        reviews: {
          include: {
            profile: true,
            images: true,
          },
        },
      },
    });
  }

  async findAllActive(): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { estado: true },
      include: {
        images: true,
        reviews: {
          include: {
            profile: true,
            images: true,
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<Product> {
    const producto = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        reviews: {
          include: {
            profile: true,
            images: true,
          },
        },
      },
    });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      return await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.product.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }
      throw error;
    }
  }

  async softRemove(id: number): Promise<Product> {
    try {
      return await this.prisma.product.update({
        where: { id },
        data: { estado: false },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }
      throw error;
    }
  }

  async removeImage(imageId: number, productId: number): Promise<void> {
    const image = await this.prisma.productImage.findFirst({
      where: { id: imageId, productId },
    });

    if (!image) {
      throw new NotFoundException(
        'Imagen no encontrada o no pertenece al producto.',
      );
    }

    await this.prisma.productImage.delete({
      where: { id: imageId },
    });
  }

  async updateWithImages(
    id: number,
    dto: UpdateProductDto,
    files?: Express.Multer.File[],
  ): Promise<Product> {
    return this.prisma.$transaction(async (tx) => {
      try {
        await tx.product.update({
          where: { id },
          data: dto,
        });

        if (files?.length) {
          const maxOrderResult = await tx.productImage.aggregate({
            where: { productId: id },
            _max: { orden: true },
          });
          const startOrder = (maxOrderResult._max.orden ?? -1) + 1;

          await Promise.all(
            files.map(async (file, idx) => {
              const url = await this.uploadImageService.uploadFileImage(file);
              return tx.productImage.create({
                data: {
                  url,
                  orden: startOrder + idx,
                  productId: id,
                },
              });
            }),
          );
        }

        const updatedProduct = await tx.product.findUnique({
          where: { id },
          include: {
            images: true,
            reviews: {
              include: {
                profile: true,
                images: true,
              },
            },
          },
        });

        if (!updatedProduct)
          throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        return updatedProduct;
      } catch (error) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        }
        throw error;
      }
    });
  }

  async get18RandomByCategoryOptimized(categoria: string): Promise<Product[]> {
    if (!categoria) return [];

    const result = await this.prisma.$queryRaw<Product[]>`
      SELECT * FROM productos 
      WHERE LOWER(categoria) = LOWER(${categoria}) 
      ORDER BY RANDOM() 
      LIMIT 18
    `;

    const ids = result.map((p) => p.id);
    if (ids.length === 0) return [];

    return this.prisma.product.findMany({
      where: { id: { in: ids } },
      include: { images: true },
    });
  }

  async findSome(): Promise<any[]> {
    const products = await this.prisma.product.findMany({
      where: { estado: true },
      include: {
        images: true,
        category: true, // Incluir la categoría
      },
    });

    return products.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio.toNumber(),
      categoria: p.category?.name ?? null, // Retornar el nombre de la categoría
      estado: p.estado,
      image: p.images?.length ? p.images[0] : null,
    }));
  }

  async fetch_products_by_category(id_category: number): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { id_category: id_category },
    });
  }
}
