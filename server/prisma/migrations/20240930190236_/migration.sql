-- CreateTable
CREATE TABLE "device" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "purchase_Date" TIMESTAMP(3) NOT NULL,
    "price" TEXT NOT NULL,
    "qr_code" TEXT,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "device_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "device" ADD CONSTRAINT "device_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
