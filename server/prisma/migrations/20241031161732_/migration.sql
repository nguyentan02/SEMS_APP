/*
  Warnings:

  - You are about to drop the `attribyutes_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `category_attribyutes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "category_attribyutes" DROP CONSTRAINT "category_attribyutes_attribyuteId_fkey";

-- DropForeignKey
ALTER TABLE "category_attribyutes" DROP CONSTRAINT "category_attribyutes_categoryId_fkey";

-- DropTable
DROP TABLE "attribyutes_category";

-- DropTable
DROP TABLE "category_attribyutes";

-- CreateTable
CREATE TABLE "attribute_category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "attribute_category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "attribute_category" ADD CONSTRAINT "attribute_category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
