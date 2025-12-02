/*
  Warnings:

  - You are about to drop the column `user_id` on the `guias` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "guias" DROP CONSTRAINT "guias_user_id_fkey";

-- AlterTable
ALTER TABLE "guias" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" INTEGER;

-- AddForeignKey
ALTER TABLE "guias" ADD CONSTRAINT "guias_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
