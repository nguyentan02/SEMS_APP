-- CreateTable
CREATE TABLE "Waste" (
    "id" SERIAL NOT NULL,
    "scrapReason" TEXT,
    "materialId" INTEGER NOT NULL,

    CONSTRAINT "Waste_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Waste" ADD CONSTRAINT "Waste_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
