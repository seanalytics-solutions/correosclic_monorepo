/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profileId]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_usuarioId_fkey";

-- DropIndex
DROP INDEX "Profile_usuarioId_key";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "usuarioId";

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "profileId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_profileId_key" ON "usuarios"("profileId");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
