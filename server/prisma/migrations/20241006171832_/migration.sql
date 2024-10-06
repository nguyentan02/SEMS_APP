/*
  Warnings:

  - Changed the type of `activityType` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('EX', 'IN');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "activityType",
ADD COLUMN     "activityType" "ActivityType" NOT NULL;
