-- CreateEnum
CREATE TYPE "StatusMaintenance" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PriorityLevel" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateTable
CREATE TABLE "notification" (
    "id" SERIAL NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenancePlan" (
    "id" SERIAL NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" INTEGER NOT NULL,
    "priority" "PriorityLevel" NOT NULL DEFAULT 'LOW',
    "maintenanceStatus" "StatusMaintenance" NOT NULL DEFAULT 'PENDING',
    "descriptionPlan" TEXT,

    CONSTRAINT "maintenancePlan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "maintenancePlan" ADD CONSTRAINT "maintenancePlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenancePlan" ADD CONSTRAINT "maintenancePlan_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
