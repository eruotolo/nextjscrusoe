-- CreateTable
CREATE TABLE "PartnerSupplierType" (
    "id" SERIAL NOT NULL,
    "partnerId" TEXT NOT NULL,
    "supplierTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerSupplierType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PartnerSupplierType_partnerId_idx" ON "PartnerSupplierType"("partnerId");

-- CreateIndex
CREATE INDEX "PartnerSupplierType_supplierTypeId_idx" ON "PartnerSupplierType"("supplierTypeId");

-- AddForeignKey
ALTER TABLE "PartnerSupplierType" ADD CONSTRAINT "PartnerSupplierType_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerSupplierType" ADD CONSTRAINT "PartnerSupplierType_supplierTypeId_fkey" FOREIGN KEY ("supplierTypeId") REFERENCES "SupplierType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
