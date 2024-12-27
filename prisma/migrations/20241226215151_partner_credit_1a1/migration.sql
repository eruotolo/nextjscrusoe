/*
  Warnings:

  - You are about to drop the column `partinerId` on the `PartnerCreditInfo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[partnerId]` on the table `PartnerCreditInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PartnerCreditInfo" DROP CONSTRAINT "PartnerCreditInfo_partinerId_fkey";

-- DropIndex
DROP INDEX "PartnerCreditInfo_partinerId_key";

-- AlterTable
ALTER TABLE "PartnerCreditInfo" DROP COLUMN "partinerId",
ADD COLUMN     "partnerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PartnerCreditInfo_partnerId_key" ON "PartnerCreditInfo"("partnerId");

-- AddForeignKey
ALTER TABLE "PartnerCreditInfo" ADD CONSTRAINT "PartnerCreditInfo_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
