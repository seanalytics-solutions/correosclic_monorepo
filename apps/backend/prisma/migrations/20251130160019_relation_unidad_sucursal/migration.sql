/*
  Warnings:

  - Added the required column `coupon_id` to the `gifted_coupons` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "gifted_coupons" DROP CONSTRAINT "gifted_coupons_user_id_fkey";

-- AlterTable
ALTER TABLE "gifted_coupons" ADD COLUMN     "coupon_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "unidad_sucursal" (
    "id" SERIAL NOT NULL,
    "clave_sucursal" TEXT NOT NULL,
    "estado_unidad" TEXT NOT NULL,
    "conductor_unidad" TEXT NOT NULL,
    "id_unidad" INTEGER NOT NULL,

    CONSTRAINT "unidad_sucursal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unidad_sucursal_id_unidad_key" ON "unidad_sucursal"("id_unidad");

-- AddForeignKey
ALTER TABLE "unidad_sucursal" ADD CONSTRAINT "unidad_sucursal_clave_sucursal_fkey" FOREIGN KEY ("clave_sucursal") REFERENCES "oficinas"("clave_cuo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidad_sucursal" ADD CONSTRAINT "unidad_sucursal_id_unidad_fkey" FOREIGN KEY ("id_unidad") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gifted_coupons" ADD CONSTRAINT "gifted_coupons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gifted_coupons" ADD CONSTRAINT "gifted_coupons_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "cupones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
