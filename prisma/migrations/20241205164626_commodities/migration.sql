-- CreateTable
CREATE TABLE "commoditiesSection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commoditiesSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commodities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEnglish" TEXT,
    "dangerous" BOOLEAN,
    "perishable" BOOLEAN,
    "tariffPositional" TEXT,
    "commoditiesSectionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commodities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "commoditiesSection_name_idx" ON "commoditiesSection"("name");

-- CreateIndex
CREATE INDEX "commodities_name_idx" ON "commodities"("name");

-- CreateIndex
CREATE INDEX "commodities_nameEnglish_idx" ON "commodities"("nameEnglish");

-- AddForeignKey
ALTER TABLE "commodities" ADD CONSTRAINT "commodities_commoditiesSectionId_fkey" FOREIGN KEY ("commoditiesSectionId") REFERENCES "commoditiesSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
