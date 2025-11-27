// schemas/products.ts
import { z } from 'zod';

// schemas/products.ts
export const BackendProductSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  descripcion: z.string(),
  precio: z.number(),
  imagen: z.string().nullable().optional(),
  categoria: z.string().nullable(),
  inventario: z.number(),
  color: z.string().nullable().optional(),
  marca: z.string().nullable().optional(),
  peso: z.number().nullable().optional(),
  dimensiones: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

/**
 * Variant para productos (compatible con CarrouselProducts)
 */
export const ProductVariantSchema = z.object({
  tipo: z.literal('Color'),
  valor: z.string(),
  price: z.number(), // ⚠️ "price" no "precio"
  inventario: z.number().int().min(0),
  sku: z.string(),
})


export const FrontendProductSchema = z.object({
  ProductID: z.number(),
  ProductName: z.string(),
  ProductDescription: z.string(),
  ProductStatus: z.boolean(),
  ProductStock: z.number(),
  productPrice: z.number(),
  ProductImageUrl: z.string(),
  ProductCategory: z.string().nullable(),
  productStockQuantity: z.number(),
  ProductColors: z.array(z.string()),
  ProductBrand: z.string(),
  ProductWeight: z.number().nullable(),
  ProductDimensions: z.string().nullable(),
  isActive: z.boolean(),
  Color: z.string(),
  createdAt: z.date().optional(),
  ProductSlug: z.string(),
  ProductSellerName: z.string(),
  ProductSold: z.number(),
  ProductCupons: z.array(z.number()),
  updatedAt: z.date().optional(),
    // variants: z.array(ProductVariantSchema),

});

export const BackendCreateProductDtoSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
  descripcion: z.string().min(1, 'Descripción es requerida'), 
  precio: z.number().positive('Precio debe ser positivo'),
  categoria: z.string().optional(),
  inventario: z.number().int().min(0).optional().default(0),
  color: z.string().optional().default('#000000'),
  isActive: z.boolean(),
  // imagen se maneja por separado en multipart
})

/**
 * Schema para UpdateProductDto
 */
export const BackendUpdateProductDtoSchema = z.object({
  nombre: z.string().min(1).optional(),
  descripcion: z.string().min(1).optional(),
  precio: z.number().positive().optional(),
  categoria: z.string().optional(),
  inventario: z.number().int().min(0).optional(),
  color: z.string().optional(),
  // imagen se maneja por separado
})


// Esquema para crear producto
export const BackendCreateProductSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  precio: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  categoria: z.string().nullable().optional(),
  inventario: z.number().min(0, "El inventario debe ser mayor o igual a 0"),
  color: z.string().nullable().optional(),
  marca: z.string().nullable().optional(),
  peso: z.number().nullable().optional(),
  dimensiones: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
});

export const ProductImageSchema = z.object({
  id: z.number(),
  url: z.string(),
  orden: z.number(),
  productId: z.number(),
})

export const BackendProductEntitySchema = z.object({
  id: z.number(),
  nombre: z.string(),
  descripcion: z.string(),
  precio: z.number(),
  categoria: z.string().nullable(),
  inventario: z.number(),
  color: z.string(),
  marca: z.string(),
  slug: z.string(),
  vendedor: z.string(),
  estado: z.boolean(),
  vendidos: z.number(),
  sku: z.string(),
  altura: z.number().nullable().optional(),
  largo: z.number().nullable().optional(),
  ancho: z.number().nullable().optional(),
  peso: z.number().nullable().optional(),
  idPerfil: z.number().nullable().optional(),
  
  images: z.array(ProductImageSchema).optional().default([]),
  
  favoritos: z.array(z.any()).optional().default([]),
  carrito: z.array(z.any()).optional().default([]),
  reviews: z.array(z.any()).optional().default([]),
})


// Tipos
export type BackendProduct = z.infer<typeof BackendProductSchema>;
export type FrontendProduct = z.infer<typeof FrontendProductSchema>;
export type BackendCreateProductDto = z.infer<typeof BackendCreateProductSchema>;
export type BackendProductEntity = z.infer<typeof BackendProductEntitySchema>;
export type BackendUpdateProductDto = z.infer<typeof BackendUpdateProductDtoSchema>
