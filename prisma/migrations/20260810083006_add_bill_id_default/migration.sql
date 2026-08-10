/*
  Warnings:

  - You are about to drop the column `billNumber` on the `bills` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "bills_billNumber_key";

-- AlterTable
ALTER TABLE "bills" DROP COLUMN "billNumber";
