/*
  Warnings:

  - You are about to drop the column `purchase_Date` on the `device` table. All the data in the column will be lost.
  - You are about to drop the column `qr_code` on the `device` table. All the data in the column will be lost.
  - Added the required column `expirationDate` to the `device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchaseDate` to the `device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `device` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `price` on the `device` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "device" DROP COLUMN "purchase_Date",
DROP COLUMN "qr_code",
ADD COLUMN     "expirationDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "lastMaintenanceDate" TIMESTAMP(3),
ADD COLUMN     "purchaseDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "qrCode" TEXT,
ADD COLUMN     "roomId" INTEGER NOT NULL,
ADD COLUMN     "statusDevice" TEXT NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "price",
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL;

-- AddForeignKey
ALTER TABLE "device" ADD CONSTRAINT "device_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
