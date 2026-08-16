/*
  Warnings:

  - A unique constraint covering the columns `[shopId,name]` on the table `Area` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shopId` to the `Area` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Area_name_key";

-- AlterTable
ALTER TABLE "Area" ADD COLUMN     "shopId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Area_shopId_idx" ON "Area"("shopId");

-- CreateIndex
CREATE UNIQUE INDEX "Area_shopId_name_key" ON "Area"("shopId", "name");

-- AddForeignKey
ALTER TABLE "Area" ADD CONSTRAINT "Area_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
