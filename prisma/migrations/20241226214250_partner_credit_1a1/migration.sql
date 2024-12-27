/*
  Warnings:

  - You are about to drop the column `creditInfoId` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `outgoingAccountNumber` on the `PartnerCreditInfo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[partinerId]` on the table `PartnerCreditInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Partner" DROP CONSTRAINT "Partner_creditInfoId_fkey";

-- DropIndex
DROP INDEX "Partner_creditInfoId_key";

-- AlterTable
ALTER TABLE "Partner" DROP COLUMN "creditInfoId";

-- AlterTable
ALTER TABLE "PartnerCreditInfo" DROP COLUMN "outgoingAccountNumber",
ADD COLUMN     "outgoingAccountMumber" TEXT,
ADD COLUMN     "partinerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PartnerCreditInfo_partinerId_key" ON "PartnerCreditInfo"("partinerId");

-- AddForeignKey
ALTER TABLE "PartnerCreditInfo" ADD CONSTRAINT "PartnerCreditInfo_partinerId_fkey" FOREIGN KEY ("partinerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
