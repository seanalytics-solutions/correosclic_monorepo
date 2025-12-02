-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_id_category_fkey" FOREIGN KEY ("id_category") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
