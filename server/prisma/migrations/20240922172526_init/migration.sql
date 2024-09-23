-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 2,
    "user_avt" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dig0nsb6m/image/upload/v1704869331/hjv353yrt9hahuomkxey.png',
    "isBan" BOOLEAN NOT NULL DEFAULT false,
    "banUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
