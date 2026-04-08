/*
  Warnings:

  - Added the required column `updatedAt` to the `Visit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `VisitActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Visit" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NULL;

-- AlterTable
ALTER TABLE "VisitActivity" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NULL;

-- Set updatedAt to current timestamp for all existing rows
UPDATE "Visit" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;
UPDATE "VisitActivity" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;

-- Make updatedAt NOT NULL
ALTER TABLE "Visit" ALTER COLUMN "updatedAt" SET NOT NULL;
ALTER TABLE "VisitActivity" ALTER COLUMN "updatedAt" SET NOT NULL;
