/*
  Warnings:

  - You are about to drop the column `placesId` on the `Partner` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Partner" DROP CONSTRAINT "Partner_placesId_fkey";

-- AlterTable
ALTER TABLE "Partner" DROP COLUMN "placesId",
ADD COLUMN     "locations" TEXT;
