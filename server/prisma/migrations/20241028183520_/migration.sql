/*
  Warnings:

  - Added the required column `symbol` to the `Deparment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deparment" ADD COLUMN     "symbol" TEXT NOT NULL;
