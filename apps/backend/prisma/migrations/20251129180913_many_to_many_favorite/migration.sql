-- CreateTable
CREATE TABLE "_Favoritos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Favoritos_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_Favoritos_B_index" ON "_Favoritos"("B");

-- AddForeignKey
ALTER TABLE "_Favoritos" ADD CONSTRAINT "_Favoritos_A_fkey" FOREIGN KEY ("A") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Favoritos" ADD CONSTRAINT "_Favoritos_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
