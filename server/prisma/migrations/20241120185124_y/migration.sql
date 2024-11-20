/*
  Warnings:

  - You are about to drop the column `end` on the `MaintenancePlan` table. All the data in the column will be lost.
  - Changed the type of `endDate` on the `MaintenancePlan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "MaintenancePlan" DROP COLUMN "end",
DROP COLUMN "endDate",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL;
