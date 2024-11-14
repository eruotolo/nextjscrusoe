/*
  Warnings:

  - You are about to drop the column `transport` on the `Incoterms` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Incoterms" DROP CONSTRAINT "Incoterms_transport_fkey";

-- AlterTable
ALTER TABLE "Incoterms" DROP COLUMN "transport";

-- CreateTable
CREATE TABLE "IncotermsTransport" (
    "id" TEXT NOT NULL,
    "incotermsId" TEXT NOT NULL,
    "transportTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IncotermsTransport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IncotermsTransport" ADD CONSTRAINT "IncotermsTransport_incotermsId_fkey" FOREIGN KEY ("incotermsId") REFERENCES "Incoterms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncotermsTransport" ADD CONSTRAINT "IncotermsTransport_transportTypeId_fkey" FOREIGN KEY ("transportTypeId") REFERENCES "TransportType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
