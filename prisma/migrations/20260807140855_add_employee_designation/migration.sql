/*
  Warnings:

  - You are about to drop the column `designation` on the `Employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "designation",
ADD COLUMN     "designationId" TEXT;

-- CreateTable
CREATE TABLE "EmployeeDesignation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeDesignation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeDesignation_name_key" ON "EmployeeDesignation"("name");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "EmployeeDesignation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
