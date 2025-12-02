/*
  Warnings:

  - You are about to drop the column `categorias_aplicables` on the `cupones` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_actualizacion` on the `cupones` table. All the data in the column will be lost.
  - You are about to drop the column `productos_aplicables` on the `cupones` table. All the data in the column will be lost.
  - You are about to drop the column `uso_unico_por_usuario` on the `cupones` table. All the data in the column will be lost.
  - You are about to drop the column `usos_actuales` on the `cupones` table. All the data in the column will be lost.
  - You are about to drop the column `usos_maximos` on the `cupones` table. All the data in the column will be lost.
  - You are about to drop the column `usuario_creador_id` on the `cupones` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cupones" DROP COLUMN "categorias_aplicables",
DROP COLUMN "fecha_actualizacion",
DROP COLUMN "productos_aplicables",
DROP COLUMN "uso_unico_por_usuario",
DROP COLUMN "usos_actuales",
DROP COLUMN "usos_maximos",
DROP COLUMN "usuario_creador_id",
ADD COLUMN     "fecha_inicio" TIMESTAMP(3),
ADD COLUMN     "usos_maximos_global" INTEGER,
ADD COLUMN     "usos_maximos_por_usuario" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "cupones_usuarios" (
    "id" SERIAL NOT NULL,
    "cupon_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "fecha_asignado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usos_restantes" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "cupones_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usos_cupones" (
    "id" SERIAL NOT NULL,
    "cupon_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "descuento_aplicado" DECIMAL(10,2) NOT NULL,
    "fecha_uso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usos_cupones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cupones_usuarios_cupon_id_usuario_id_key" ON "cupones_usuarios"("cupon_id", "usuario_id");

-- AddForeignKey
ALTER TABLE "cupones_usuarios" ADD CONSTRAINT "cupones_usuarios_cupon_id_fkey" FOREIGN KEY ("cupon_id") REFERENCES "cupones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cupones_usuarios" ADD CONSTRAINT "cupones_usuarios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usos_cupones" ADD CONSTRAINT "usos_cupones_cupon_id_fkey" FOREIGN KEY ("cupon_id") REFERENCES "cupones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usos_cupones" ADD CONSTRAINT "usos_cupones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usos_cupones" ADD CONSTRAINT "usos_cupones_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
