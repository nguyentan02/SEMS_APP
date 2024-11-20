/*
  Warnings:

  - You are about to drop the `maintenancePlan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "maintenancePlan" DROP CONSTRAINT "maintenancePlan_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "maintenancePlan" DROP CONSTRAINT "maintenancePlan_userId_fkey";

-- AlterTable
ALTER TABLE "device" ALTER COLUMN "statusDevice" SET DEFAULT 'KHÔNG HOẠT ĐỘNG';

-- DropTable
DROP TABLE "maintenancePlan";

-- CreateTable
CREATE TABLE "MaintenancePlan" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" INTEGER NOT NULL,
    "priority" "PriorityLevel" NOT NULL DEFAULT 'LOW',
    "maintenanceStatus" "StatusMaintenance" NOT NULL DEFAULT 'PENDING',
    "cost" DECIMAL(65,30) DEFAULT 0.00,
    "descriptionPlan" TEXT,

    CONSTRAINT "MaintenancePlan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MaintenancePlan" ADD CONSTRAINT "MaintenancePlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenancePlan" ADD CONSTRAINT "MaintenancePlan_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
