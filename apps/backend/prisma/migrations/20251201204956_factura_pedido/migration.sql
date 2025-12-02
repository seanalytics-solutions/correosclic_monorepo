/*
  Warnings:

  - A unique constraint covering the columns `[pedido_id]` on the table `facturas` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "facturas" ADD COLUMN     "pedido_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "facturas_pedido_id_key" ON "facturas"("pedido_id");

-- AddForeignKey
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedido"("id") ON DELETE SET NULL ON UPDATE CASCADE;
