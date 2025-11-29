/*
  Warnings:

  - You are about to drop the column `curp` on the `asignaciones_historial` table. All the data in the column will be lost.
  - You are about to drop the column `nombre_conductor` on the `asignaciones_historial` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_conductor]` on the table `asignaciones_historial` will be added. If there are existing duplicate values, this will fail.
  - Made the column `clave_cuo_destino` on table `asignaciones_historial` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "asignaciones_historial" DROP COLUMN "curp",
DROP COLUMN "nombre_conductor",
ADD COLUMN     "id_conductor" INTEGER,
ADD COLUMN     "id_oficina" INTEGER,
ADD COLUMN     "id_pedidos" INTEGER,
ADD COLUMN     "id_unidades" INTEGER,
ALTER COLUMN "clave_cuo_destino" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "asignaciones_historial_id_conductor_key" ON "asignaciones_historial"("id_conductor");

-- AddForeignKey
ALTER TABLE "asignaciones_historial" ADD CONSTRAINT "asignaciones_historial_id_oficina_fkey" FOREIGN KEY ("id_oficina") REFERENCES "oficinas"("id_oficina") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_historial" ADD CONSTRAINT "asignaciones_historial_id_unidades_fkey" FOREIGN KEY ("id_unidades") REFERENCES "unidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_historial" ADD CONSTRAINT "asignaciones_historial_id_pedidos_fkey" FOREIGN KEY ("id_pedidos") REFERENCES "pedido"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_historial" ADD CONSTRAINT "asignaciones_historial_id_conductor_fkey" FOREIGN KEY ("id_conductor") REFERENCES "conductores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
