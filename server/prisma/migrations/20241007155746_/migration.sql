/*
  Warnings:

  - Added the required column `wasteCode` to the `Waste` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Waste" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "wasteCode" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ActualQuantity" (
    "id" SERIAL NOT NULL,
    "materialId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActualQuantity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActualQuantity" ADD CONSTRAINT "ActualQuantity_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
