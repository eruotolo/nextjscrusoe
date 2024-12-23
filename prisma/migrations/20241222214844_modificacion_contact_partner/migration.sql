/*
  Warnings:

  - You are about to drop the `PartnerContact` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PartnerContact" DROP CONSTRAINT "PartnerContact_contactId_fkey";

-- DropForeignKey
ALTER TABLE "PartnerContact" DROP CONSTRAINT "PartnerContact_partnerId_fkey";

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "partnerId" TEXT;

-- DropTable
DROP TABLE "PartnerContact";

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
