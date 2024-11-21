/*
  Warnings:

  - The values [REJECTED] on the enum `StatusMaintenance` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusMaintenance_new" AS ENUM ('PENDING', 'APPROVED', 'CANCEL', 'COMPLETED', 'LATE');
ALTER TABLE "MaintenancePlan" ALTER COLUMN "maintenanceStatus" DROP DEFAULT;
ALTER TABLE "MaintenancePlan" ALTER COLUMN "maintenanceStatus" TYPE "StatusMaintenance_new" USING ("maintenanceStatus"::text::"StatusMaintenance_new");
ALTER TYPE "StatusMaintenance" RENAME TO "StatusMaintenance_old";
ALTER TYPE "StatusMaintenance_new" RENAME TO "StatusMaintenance";
DROP TYPE "StatusMaintenance_old";
ALTER TABLE "MaintenancePlan" ALTER COLUMN "maintenanceStatus" SET DEFAULT 'PENDING';
COMMIT;
