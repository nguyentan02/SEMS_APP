/*
  Warnings:

  - You are about to drop the `TranferDevice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TranferDevice" DROP CONSTRAINT "TranferDevice_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "TranferDevice" DROP CONSTRAINT "TranferDevice_newLocationId_fkey";

-- DropForeignKey
ALTER TABLE "TranferDevice" DROP CONSTRAINT "TranferDevice_oldLocationId_fkey";

-- DropTable
DROP TABLE "TranferDevice";

-- CreateTable
CREATE TABLE "RotationDevice" (
    "id" SERIAL NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "oldLocationId" INTEGER NOT NULL,
    "newLocationId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "transferDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RotationDevice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RotationDevice" ADD CONSTRAINT "RotationDevice_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotationDevice" ADD CONSTRAINT "RotationDevice_oldLocationId_fkey" FOREIGN KEY ("oldLocationId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotationDevice" ADD CONSTRAINT "RotationDevice_newLocationId_fkey" FOREIGN KEY ("newLocationId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
