/*
  Warnings:

  - You are about to drop the column `contactId` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `PartnerContact` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `PartnerContact` table. All the data in the column will be lost.
  - You are about to drop the column `partnerContactTypeId` on the `PartnerContact` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `PartnerContact` table. All the data in the column will be lost.
  - You are about to drop the `PartnerContactType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Partner" DROP CONSTRAINT "Partner_contactId_fkey";

-- DropForeignKey
ALTER TABLE "PartnerContact" DROP CONSTRAINT "PartnerContact_partnerContactTypeId_fkey";

-- DropIndex
DROP INDEX "PartnerContact_name_idx";

-- AlterTable
ALTER TABLE "Partner" DROP COLUMN "contactId";

-- AlterTable
ALTER TABLE "PartnerContact" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "partnerContactTypeId",
DROP COLUMN "phone",
ADD COLUMN     "contactId" TEXT,
ADD COLUMN     "partnerId" TEXT;

-- DropTable
DROP TABLE "PartnerContactType";

-- CreateTable
CREATE TABLE "ContactType" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "contactTypeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContactType_name_idx" ON "ContactType"("name");

-- CreateIndex
CREATE INDEX "Contact_name_idx" ON "Contact"("name");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_contactTypeId_fkey" FOREIGN KEY ("contactTypeId") REFERENCES "ContactType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerContact" ADD CONSTRAINT "PartnerContact_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerContact" ADD CONSTRAINT "PartnerContact_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
