/*
  Warnings:

  - You are about to drop the column `profileId` on the `usuarios` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usuario_id]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_profileId_fkey";

-- DropIndex
DROP INDEX "usuarios_profileId_key";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "usuario_id" INTEGER;

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "profileId";

-- CreateIndex
CREATE UNIQUE INDEX "Profile_usuario_id_key" ON "Profile"("usuario_id");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
