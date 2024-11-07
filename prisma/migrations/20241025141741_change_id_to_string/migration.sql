/*
  Warnings:

  - The primary key for the `Airports` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ShippingPorts` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Airports" DROP CONSTRAINT "Airports_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Airports_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Airports_id_seq";

-- AlterTable
ALTER TABLE "ShippingPorts" DROP CONSTRAINT "ShippingPorts_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ShippingPorts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ShippingPorts_id_seq";
