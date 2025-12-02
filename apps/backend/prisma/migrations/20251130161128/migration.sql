/*
  Warnings:

  - You are about to drop the column `profileId` on the `usuarios` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usuarioId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_profileId_fkey";

-- DropIndex
DROP INDEX "usuarios_profileId_key";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "usuarioId" INTEGER;

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "profileId";

-- CreateIndex
CREATE UNIQUE INDEX "Profile_usuarioId_key" ON "Profile"("usuarioId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
