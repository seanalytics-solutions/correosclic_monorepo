/*
  Warnings:

  - A unique constraint covering the columns `[correo]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - Made the column `contrasena` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contrasena` on table `usuarios` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CuponesTipoEnum" AS ENUM ('porcentaje', 'monto_fijo');

-- CreateEnum
CREATE TYPE "CuponesEstadoEnum" AS ENUM ('activo', 'inactivo', 'expirado');

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "contrasena" SET NOT NULL;

-- AlterTable
ALTER TABLE "usuarios" ALTER COLUMN "contrasena" SET NOT NULL;

-- CreateTable
CREATE TABLE "cupones" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(200) NOT NULL,
    "tipo" "CuponesTipoEnum" NOT NULL DEFAULT 'porcentaje',
    "valor" DECIMAL(10,2) NOT NULL,
    "monto_minimo" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "descuento_maximo" DECIMAL(10,2),
    "usos_maximos" INTEGER NOT NULL DEFAULT 1,
    "usos_actuales" INTEGER NOT NULL DEFAULT 0,
    "fecha_expiracion" TIMESTAMP(3),
    "estado" "CuponesEstadoEnum" NOT NULL DEFAULT 'activo',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_creador_id" INTEGER,
    "uso_unico_por_usuario" BOOLEAN NOT NULL DEFAULT false,
    "categorias_aplicables" JSONB,
    "productos_aplicables" JSONB,

    CONSTRAINT "cupones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cupones_codigo_key" ON "cupones"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");
