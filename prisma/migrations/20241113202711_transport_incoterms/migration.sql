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
    "transport" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Incoterms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TransportType_name_idx" ON "TransportType"("name");

-- CreateIndex
CREATE INDEX "Incoterms_name_idx" ON "Incoterms"("name");

-- CreateIndex
CREATE INDEX "Incoterms_code_idx" ON "Incoterms"("code");

-- AddForeignKey
ALTER TABLE "Incoterms" ADD CONSTRAINT "Incoterms_transport_fkey" FOREIGN KEY ("transport") REFERENCES "TransportType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
