/*
  Warnings:

  - Added the required column `userId` to the `ActualQuantity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActualQuantity" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ActualQuantity" ADD CONSTRAINT "ActualQuantity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
