/*
  Warnings:

  - You are about to drop the `commodities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `commoditiesSection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "commodities" DROP CONSTRAINT "commodities_commoditiesSectionId_fkey";

-- DropTable
DROP TABLE "commodities";

-- DropTable
DROP TABLE "commoditiesSection";

-- CreateTable
CREATE TABLE "CommoditiesSection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommoditiesSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commodities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEnglish" TEXT,
    "dangerous" BOOLEAN,
    "perishable" BOOLEAN,
    "tariffPositional" TEXT,
    "commoditiesSectionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Commodities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommoditiesSection_name_idx" ON "CommoditiesSection"("name");

-- CreateIndex
CREATE INDEX "Commodities_name_idx" ON "Commodities"("name");

-- CreateIndex
CREATE INDEX "Commodities_nameEnglish_idx" ON "Commodities"("nameEnglish");

-- AddForeignKey
ALTER TABLE "Commodities" ADD CONSTRAINT "Commodities_commoditiesSectionId_fkey" FOREIGN KEY ("commoditiesSectionId") REFERENCES "CommoditiesSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
