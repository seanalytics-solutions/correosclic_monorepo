-- CreateEnum
CREATE TYPE "ProductEstadoEnum" AS ENUM ('activo', 'inactivo', 'agotado', 'pausado');

-- AlterTable
ALTER TABLE "productos" ADD COLUMN     "real_status" "ProductEstadoEnum" DEFAULT 'activo';
