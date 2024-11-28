-- DropForeignKey
ALTER TABLE "IncotermsTransport" DROP CONSTRAINT "IncotermsTransport_incotermsId_fkey";

-- DropForeignKey
ALTER TABLE "IncotermsTransport" DROP CONSTRAINT "IncotermsTransport_transportTypeId_fkey";

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

-- AddForeignKey
ALTER TABLE "IncotermsTransport" ADD CONSTRAINT "IncotermsTransport_incotermsId_fkey" FOREIGN KEY ("incotermsId") REFERENCES "Incoterms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncotermsTransport" ADD CONSTRAINT "IncotermsTransport_transportTypeId_fkey" FOREIGN KEY ("transportTypeId") REFERENCES "TransportType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ships" ADD CONSTRAINT "Ships_shipownerId_fkey" FOREIGN KEY ("shipownerId") REFERENCES "Shipowner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ships" ADD CONSTRAINT "Ships_codeCountry_fkey" FOREIGN KEY ("codeCountry") REFERENCES "Country"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ships" ADD CONSTRAINT "Ships_shipsTypeId_fkey" FOREIGN KEY ("shipsTypeId") REFERENCES "ShipsType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
