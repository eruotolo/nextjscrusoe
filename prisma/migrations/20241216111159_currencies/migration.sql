-- AlterTable
ALTER TABLE "Partner" ADD COLUMN     "partnerTypeId" TEXT;

-- CreateTable
CREATE TABLE "Currencies" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "name" TEXT,
    "symbol" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Currencies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PartnerContact_name_idx" ON "PartnerContact"("name");

-- CreateIndex
CREATE INDEX "PartnerContactType_name_idx" ON "PartnerContactType"("name");

-- CreateIndex
CREATE INDEX "PartnerCreditInfo_id_idx" ON "PartnerCreditInfo"("id");

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_partnerTypeId_fkey" FOREIGN KEY ("partnerTypeId") REFERENCES "PartnerType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerCreditInfo" ADD CONSTRAINT "PartnerCreditInfo_freightCreditCurrency_fkey" FOREIGN KEY ("freightCreditCurrency") REFERENCES "Currencies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PartnerCreditInfo" ADD CONSTRAINT "PartnerCreditInfo_termCreditCurrency_fkey" FOREIGN KEY ("termCreditCurrency") REFERENCES "Currencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
