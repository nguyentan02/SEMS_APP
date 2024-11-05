-- CreateTable
CREATE TABLE "device_attribute_values" (
    "id" SERIAL NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "attributeId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "device_attribute_values_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "device_attribute_values" ADD CONSTRAINT "device_attribute_values_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_attribute_values" ADD CONSTRAINT "device_attribute_values_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "attribute_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
