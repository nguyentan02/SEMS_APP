/*
  Warnings:

  - Made the column `roomId` on table `MaintenancePlan` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "MaintenancePlan" DROP CONSTRAINT "MaintenancePlan_roomId_fkey";

-- AlterTable
ALTER TABLE "MaintenancePlan" ALTER COLUMN "roomId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "MaintenancePlan" ADD CONSTRAINT "MaintenancePlan_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
