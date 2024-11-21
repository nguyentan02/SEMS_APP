/*
  Warnings:

  - Added the required column `maintenanceId` to the `notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "maintenanceId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "MaintenancePlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
