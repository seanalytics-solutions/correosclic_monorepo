-- AlterTable
ALTER TABLE "solicitud_vendedor" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "solicitud_vendedor" ADD CONSTRAINT "solicitud_vendedor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
