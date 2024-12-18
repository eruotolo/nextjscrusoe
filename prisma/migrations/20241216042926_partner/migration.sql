-- CreateTable
CREATE TABLE "SupplierType" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupplierType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerType" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "socialReazon" TEXT,
    "taxId" TEXT,
    "address" TEXT,
    "zipCode" TEXT,
    "placesId" TEXT,
    "codeCountry" TEXT,
    "codeCity" INTEGER,
    "phone" TEXT,
    "scacCode" TEXT,
    "contactId" TEXT,
    "creditInfoId" TEXT,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerContactType" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerContactType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerContact" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "partnerContactTypeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerCreditInfo" (
    "id" TEXT NOT NULL,
    "freightCreditTerm" TEXT,
    "freightCreditAmount" TEXT,
    "freightCreditCurrency" TEXT,
    "termCreditExpenses" TEXT,
    "termCreditAmount" TEXT,
    "termCreditCurrency" TEXT,
    "incomeAccountNumber" TEXT,
    "outgoingAccountMumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerCreditInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SupplierType_name_idx" ON "SupplierType"("name");

-- CreateIndex
CREATE INDEX "PartnerType_name_idx" ON "PartnerType"("name");

-- CreateIndex
CREATE INDEX "Partner_name_idx" ON "Partner"("name");

-- CreateIndex
CREATE INDEX "Partner_socialReazon_idx" ON "Partner"("socialReazon");

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_placesId_fkey" FOREIGN KEY ("placesId") REFERENCES "Places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_codeCountry_fkey" FOREIGN KEY ("codeCountry") REFERENCES "Country"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_codeCity_fkey" FOREIGN KEY ("codeCity") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "PartnerContact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_creditInfoId_fkey" FOREIGN KEY ("creditInfoId") REFERENCES "PartnerCreditInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerContact" ADD CONSTRAINT "PartnerContact_partnerContactTypeId_fkey" FOREIGN KEY ("partnerContactTypeId") REFERENCES "PartnerContactType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
