/*
  Warnings:

  - You are about to drop the column `employeeId` on the `User` table. All the data in the column will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "employeeId",
ALTER COLUMN "name" SET NOT NULL;
