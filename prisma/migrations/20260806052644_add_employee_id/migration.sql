/*
  Warnings:

  - The values [BUSINESS] on the enum `NoteCategory` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[employeeId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employeeId` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NoteCategory_new" AS ENUM ('GENERAL', 'PERSONAL', 'WORK', 'FINANCE', 'IDEAS', 'REMINDER', 'OTHER');
ALTER TABLE "notes" ALTER COLUMN "category" TYPE "NoteCategory_new" USING ("category"::text::"NoteCategory_new");
ALTER TYPE "NoteCategory" RENAME TO "NoteCategory_old";
ALTER TYPE "NoteCategory_new" RENAME TO "NoteCategory";
DROP TYPE "public"."NoteCategory_old";
COMMIT;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "employeeId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeId_key" ON "Employee"("employeeId");
