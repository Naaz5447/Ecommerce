-- DropForeignKey
ALTER TABLE "otps" DROP CONSTRAINT "otps_shopId_fkey";

-- AddForeignKey
ALTER TABLE "otps" ADD CONSTRAINT "otps_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
