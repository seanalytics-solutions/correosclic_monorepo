-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "guia_id" TEXT;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_guia_id_fkey" FOREIGN KEY ("guia_id") REFERENCES "guias"("id_guia") ON DELETE SET NULL ON UPDATE CASCADE;
