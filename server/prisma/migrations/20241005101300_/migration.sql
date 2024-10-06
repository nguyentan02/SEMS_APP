-- CreateTable
CREATE TABLE "ListMaterials" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ListMaterials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,
    "quantity" INTEGER NOT NULL,
    "note" TEXT,
    "image" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dnhndgzes/image/upload/v1728122320/frdlrynketnd07okysmg.png',
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ListMaterials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
