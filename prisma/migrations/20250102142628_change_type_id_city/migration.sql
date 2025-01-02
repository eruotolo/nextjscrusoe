/*
  Warnings:

  - The primary key for the `City` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Partner" DROP CONSTRAINT "Partner_codeCity_fkey";

-- DropForeignKey
ALTER TABLE "Places" DROP CONSTRAINT "Places_codeCity_fkey";

-- AlterTable
ALTER TABLE "City" DROP CONSTRAINT "City_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "City_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "City_id_seq";

-- AlterTable
ALTER TABLE "Partner" ALTER COLUMN "codeCity" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Places" ALTER COLUMN "codeCity" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Places" ADD CONSTRAINT "Places_codeCity_fkey" FOREIGN KEY ("codeCity") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_codeCity_fkey" FOREIGN KEY ("codeCity") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;
