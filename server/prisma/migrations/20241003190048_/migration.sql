/*
  Warnings:

  - Added the required column `roomId` to the `UsageInformation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UsageInformation" ADD COLUMN     "roomId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UsageInformation" ADD CONSTRAINT "UsageInformation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
