-- CreateTable
CREATE TABLE "UsageInformation" (
    "id" SERIAL NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "usage_start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usage_end" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3),
    "purpose" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UsageInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranferDevice" (
    "id" SERIAL NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "oldLocationId" INTEGER NOT NULL,
    "newLocationId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "transferDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TranferDevice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UsageInformation" ADD CONSTRAINT "UsageInformation_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranferDevice" ADD CONSTRAINT "TranferDevice_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranferDevice" ADD CONSTRAINT "TranferDevice_oldLocationId_fkey" FOREIGN KEY ("oldLocationId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranferDevice" ADD CONSTRAINT "TranferDevice_newLocationId_fkey" FOREIGN KEY ("newLocationId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
