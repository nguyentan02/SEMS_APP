-- AlterTable
ALTER TABLE "device" ALTER COLUMN "image" SET DEFAULT 'https://res.cloudinary.com/dnhndgzes/image/upload/v1728122320/frdlrynketnd07okysmg.png';

-- AlterTable
ALTER TABLE "device_attribute_values" ALTER COLUMN "value" DROP NOT NULL;
