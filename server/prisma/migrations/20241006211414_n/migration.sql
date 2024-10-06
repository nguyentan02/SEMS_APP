/*
  Warnings:

  - You are about to drop the column `scrapReason` on the `Waste` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Waste" DROP COLUMN "scrapReason",
ADD COLUMN     "wasteReason" TEXT;
