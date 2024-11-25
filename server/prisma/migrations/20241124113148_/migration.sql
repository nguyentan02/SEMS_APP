-- DropForeignKey
ALTER TABLE "UsageInformation" DROP CONSTRAINT "UsageInformation_roomId_fkey";

-- AddForeignKey
ALTER TABLE "UsageInformation" ADD CONSTRAINT "UsageInformation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
