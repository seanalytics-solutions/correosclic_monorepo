/*
  Warnings:

  - You are about to drop the column `order_id` on the `complaints` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `complaints` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "complaints" DROP CONSTRAINT "complaints_order_id_fkey";

-- DropForeignKey
ALTER TABLE "complaints" DROP CONSTRAINT "complaints_profile_id_fkey";

-- AlterTable
ALTER TABLE "complaints" DROP COLUMN "order_id",
DROP COLUMN "profile_id",
ADD COLUMN     "pedido_id" INTEGER,
ADD COLUMN     "producto_id" INTEGER,
ADD COLUMN     "profileId" INTEGER;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
