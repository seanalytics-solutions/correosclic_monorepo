/*
  Warnings:

  - You are about to drop the column `profileId` on the `favorito` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "favorito" DROP CONSTRAINT "favorito_profileId_fkey";

-- AlterTable
ALTER TABLE "favorito" DROP COLUMN "profileId",
ADD COLUMN     "usuarioId" INTEGER;

-- AddForeignKey
ALTER TABLE "favorito" ADD CONSTRAINT "favorito_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
