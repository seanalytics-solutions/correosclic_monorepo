/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profileId]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "descuentos_tipo_enum" AS ENUM ('porcentaje', 'monto_fijo');

-- CreateEnum
CREATE TYPE "descuentos_tipo_aplicacion_enum" AS ENUM ('producto', 'categoria', 'carrito', 'envio');

-- CreateEnum
CREATE TYPE "descuentos_estado_enum" AS ENUM ('activo', 'inactivo', 'programado', 'expirado');

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_usuarioId_fkey";

-- DropIndex
DROP INDEX "Profile_usuarioId_key";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "usuarioId";

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "profileId" INTEGER;

-- CreateTable
CREATE TABLE "deletion_reasons" (
    "id" SERIAL NOT NULL,
    "selected_reason" TEXT NOT NULL,
    "other_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "deletion_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "descuentos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "tipo" "descuentos_tipo_enum" NOT NULL DEFAULT 'porcentaje',
    "valor" DECIMAL(10,2) NOT NULL,
    "tipo_aplicacion" "descuentos_tipo_aplicacion_enum" NOT NULL,
    "valores_aplicacion" JSONB,
    "monto_minimo" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "descuento_maximo" DECIMAL(10,2),
    "fecha_inicio" TIMESTAMP(3),
    "fecha_fin" TIMESTAMP(3),
    "estado" "descuentos_estado_enum" NOT NULL DEFAULT 'activo',
    "prioridad" INTEGER NOT NULL DEFAULT 10,
    "combinable" BOOLEAN NOT NULL DEFAULT true,
    "combinable_con_cupones" BOOLEAN NOT NULL DEFAULT true,
    "usos_maximos" INTEGER,
    "usos_actuales" INTEGER NOT NULL DEFAULT 0,
    "automatico" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_creador_id" INTEGER,

    CONSTRAINT "descuentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_profileId_key" ON "usuarios"("profileId");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deletion_reasons" ADD CONSTRAINT "deletion_reasons_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
