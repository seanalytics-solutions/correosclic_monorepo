/*
  Warnings:

  - You are about to drop the column `guia_id` on the `usuarios` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_guia_id_fkey";

-- AlterTable
ALTER TABLE "guias" ADD COLUMN     "user_id" INTEGER;

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "guia_id";

-- AddForeignKey
ALTER TABLE "guias" ADD CONSTRAINT "guias_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
