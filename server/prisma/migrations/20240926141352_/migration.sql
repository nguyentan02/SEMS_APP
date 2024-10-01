-- CreateTable
CREATE TABLE "Deparment" (
    "id" SERIAL NOT NULL,
    "deparmentName" TEXT NOT NULL,

    CONSTRAINT "Deparment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "roomName" TEXT NOT NULL,
    "deparmentId" INTEGER NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribyutes_category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "attribyutes_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_attribyutes" (
    "categoryId" INTEGER NOT NULL,
    "attribyuteId" INTEGER NOT NULL,

    CONSTRAINT "category_attribyutes_pkey" PRIMARY KEY ("categoryId","attribyuteId")
);

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_deparmentId_fkey" FOREIGN KEY ("deparmentId") REFERENCES "Deparment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_attribyutes" ADD CONSTRAINT "category_attribyutes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_attribyutes" ADD CONSTRAINT "category_attribyutes_attribyuteId_fkey" FOREIGN KEY ("attribyuteId") REFERENCES "attribyutes_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
