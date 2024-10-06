-- AlterTable
ALTER TABLE "Material" ALTER COLUMN "quantity" DROP NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 0;
