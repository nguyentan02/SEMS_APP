-- DropForeignKey
ALTER TABLE "category_attribyutes" DROP CONSTRAINT "category_attribyutes_attribyuteId_fkey";

-- DropForeignKey
ALTER TABLE "category_attribyutes" DROP CONSTRAINT "category_attribyutes_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "category_attribyutes" ADD CONSTRAINT "category_attribyutes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_attribyutes" ADD CONSTRAINT "category_attribyutes_attribyuteId_fkey" FOREIGN KEY ("attribyuteId") REFERENCES "attribyutes_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
