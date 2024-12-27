/*
  Warnings:

  - You are about to drop the column `outgoingAccountMumber` on the `PartnerCreditInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PartnerCreditInfo" DROP COLUMN "outgoingAccountMumber",
ADD COLUMN     "outgoingAccountNumber" TEXT;
