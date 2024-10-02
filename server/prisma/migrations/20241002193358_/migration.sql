-- DropForeignKey
ALTER TABLE "device" DROP CONSTRAINT "device_roomId_fkey";

-- AlterTable
ALTER TABLE "device" ALTER COLUMN "roomId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "device" ADD CONSTRAINT "device_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
