/*
  Warnings:

  - You are about to drop the column `usage_end` on the `UsageInformation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UsageInformation" DROP COLUMN "usage_end";

-- AlterTable
ALTER TABLE "device" ADD COLUMN     "expired" BOOLEAN NOT NULL DEFAULT false;
