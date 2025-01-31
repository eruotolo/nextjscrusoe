-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "password" TEXT NOT NULL,
    "image" TEXT DEFAULT 'Hola',
    "state" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleId" TEXT,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "countryCode" TEXT,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Airports" (
    "id" TEXT NOT NULL,
    "geocode" TEXT,
    "name" TEXT NOT NULL,
    "gcdiata" TEXT NOT NULL,
    "gcdicao" TEXT,
    "codeCountry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "Airports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingPorts" (
    "id" TEXT NOT NULL,
    "unCode" TEXT,
    "name" TEXT NOT NULL,
    "codeCountry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "ShippingPorts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Places" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "codeCountry" TEXT,
    "codeCity" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address" TEXT,
    "contactEmail" TEXT,
    "contactName" TEXT,
    "contactPhone" TEXT,
    "zipCode" TEXT,

    CONSTRAINT "Places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransportType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransportType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incoterms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Incoterms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncotermsTransport" (
    "id" TEXT NOT NULL,
    "incotermsId" TEXT NOT NULL,
    "transportTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IncotermsTransport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ships" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "shipownerId" TEXT NOT NULL,
    "codeCountry" TEXT,
    "shipsTypeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipowner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shipowner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipsType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShipsType_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Traffics" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "nameEnglish" TEXT,
    "modifiedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Traffics_pkey" PRIMARY KEY ("id")
);

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
    "codeCountry" TEXT,
    "codeCity" TEXT,
    "phone" TEXT,
    "scacCode" TEXT,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "partnerTypeId" TEXT,
    "rut" TEXT,
    "locations" TEXT,
    "email" TEXT,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

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
    "partnerId" TEXT,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "outgoingAccountNumber" TEXT,
    "partnerId" TEXT,

    CONSTRAINT "PartnerCreditInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currencies" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "name" TEXT,
    "symbol" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerSupplierType" (
    "id" SERIAL NOT NULL,
    "partnerId" TEXT NOT NULL,
    "supplierTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerSupplierType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- CreateIndex
CREATE INDEX "City_name_idx" ON "City"("name");

-- CreateIndex
CREATE INDEX "City_countryCode_idx" ON "City"("countryCode");

-- CreateIndex
CREATE INDEX "Airports_name_idx" ON "Airports"("name");

-- CreateIndex
CREATE INDEX "Airports_codeCountry_idx" ON "Airports"("codeCountry");

-- CreateIndex
CREATE INDEX "ShippingPorts_name_idx" ON "ShippingPorts"("name");

-- CreateIndex
CREATE INDEX "ShippingPorts_codeCountry_idx" ON "ShippingPorts"("codeCountry");

-- CreateIndex
CREATE INDEX "Places_name_idx" ON "Places"("name");

-- CreateIndex
CREATE INDEX "Places_codeCountry_idx" ON "Places"("codeCountry");

-- CreateIndex
CREATE INDEX "Places_codeCity_idx" ON "Places"("codeCity");

-- CreateIndex
CREATE INDEX "TransportType_name_idx" ON "TransportType"("name");

-- CreateIndex
CREATE INDEX "Incoterms_name_idx" ON "Incoterms"("name");

-- CreateIndex
CREATE INDEX "Incoterms_code_idx" ON "Incoterms"("code");

-- CreateIndex
CREATE INDEX "CommoditiesSection_name_idx" ON "CommoditiesSection"("name");

-- CreateIndex
CREATE INDEX "Commodities_name_idx" ON "Commodities"("name");

-- CreateIndex
CREATE INDEX "Commodities_nameEnglish_idx" ON "Commodities"("nameEnglish");

-- CreateIndex
CREATE INDEX "Traffics_name_idx" ON "Traffics"("name");

-- CreateIndex
CREATE INDEX "Traffics_nameEnglish_idx" ON "Traffics"("nameEnglish");

-- CreateIndex
CREATE INDEX "SupplierType_name_idx" ON "SupplierType"("name");

-- CreateIndex
CREATE INDEX "PartnerType_name_idx" ON "PartnerType"("name");

-- CreateIndex
CREATE INDEX "Partner_name_idx" ON "Partner"("name");

-- CreateIndex
CREATE INDEX "Partner_socialReazon_idx" ON "Partner"("socialReazon");

-- CreateIndex
CREATE INDEX "ContactType_name_idx" ON "ContactType"("name");

-- CreateIndex
CREATE INDEX "Contact_name_idx" ON "Contact"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerCreditInfo_partnerId_key" ON "PartnerCreditInfo"("partnerId");

-- CreateIndex
CREATE INDEX "PartnerCreditInfo_id_idx" ON "PartnerCreditInfo"("id");

-- CreateIndex
CREATE INDEX "PartnerSupplierType_partnerId_idx" ON "PartnerSupplierType"("partnerId");

-- CreateIndex
CREATE INDEX "PartnerSupplierType_supplierTypeId_idx" ON "PartnerSupplierType"("supplierTypeId");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "Country"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Airports" ADD CONSTRAINT "Airports_codeCountry_fkey" FOREIGN KEY ("codeCountry") REFERENCES "Country"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingPorts" ADD CONSTRAINT "ShippingPorts_codeCountry_fkey" FOREIGN KEY ("codeCountry") REFERENCES "Country"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Places" ADD CONSTRAINT "Places_codeCity_fkey" FOREIGN KEY ("codeCity") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Places" ADD CONSTRAINT "Places_codeCountry_fkey" FOREIGN KEY ("codeCountry") REFERENCES "Country"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncotermsTransport" ADD CONSTRAINT "IncotermsTransport_incotermsId_fkey" FOREIGN KEY ("incotermsId") REFERENCES "Incoterms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncotermsTransport" ADD CONSTRAINT "IncotermsTransport_transportTypeId_fkey" FOREIGN KEY ("transportTypeId") REFERENCES "TransportType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ships" ADD CONSTRAINT "Ships_codeCountry_fkey" FOREIGN KEY ("codeCountry") REFERENCES "Country"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ships" ADD CONSTRAINT "Ships_shipownerId_fkey" FOREIGN KEY ("shipownerId") REFERENCES "Shipowner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ships" ADD CONSTRAINT "Ships_shipsTypeId_fkey" FOREIGN KEY ("shipsTypeId") REFERENCES "ShipsType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commodities" ADD CONSTRAINT "Commodities_commoditiesSectionId_fkey" FOREIGN KEY ("commoditiesSectionId") REFERENCES "CommoditiesSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Traffics" ADD CONSTRAINT "Traffics_modifiedBy_fkey" FOREIGN KEY ("modifiedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_codeCity_fkey" FOREIGN KEY ("codeCity") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_codeCountry_fkey" FOREIGN KEY ("codeCountry") REFERENCES "Country"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_partnerTypeId_fkey" FOREIGN KEY ("partnerTypeId") REFERENCES "PartnerType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_contactTypeId_fkey" FOREIGN KEY ("contactTypeId") REFERENCES "ContactType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerCreditInfo" ADD CONSTRAINT "PartnerCreditInfo_freightCreditCurrency_fkey" FOREIGN KEY ("freightCreditCurrency") REFERENCES "Currencies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PartnerCreditInfo" ADD CONSTRAINT "PartnerCreditInfo_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerCreditInfo" ADD CONSTRAINT "PartnerCreditInfo_termCreditCurrency_fkey" FOREIGN KEY ("termCreditCurrency") REFERENCES "Currencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerSupplierType" ADD CONSTRAINT "PartnerSupplierType_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerSupplierType" ADD CONSTRAINT "PartnerSupplierType_supplierTypeId_fkey" FOREIGN KEY ("supplierTypeId") REFERENCES "SupplierType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
