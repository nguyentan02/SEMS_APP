/*
  Warnings:

  - Added the required column `quantity` to the `Waste` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Waste" ADD COLUMN     "quantity" INTEGER NOT NULL;
