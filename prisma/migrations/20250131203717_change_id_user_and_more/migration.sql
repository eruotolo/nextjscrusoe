/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Partner" DROP CONSTRAINT "Partner_userId_fkey";

-- DropForeignKey
ALTER TABLE "Traffics" DROP CONSTRAINT "Traffics_modifiedBy_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_userId_fkey";

-- AlterTable
ALTER TABLE "Partner" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Traffics" ALTER COLUMN "modifiedBy" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "UserRole" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "Country_name_idx" ON "Country"("name");

-- CreateIndex
CREATE INDEX "Country_code_idx" ON "Country"("code");

-- CreateIndex
CREATE INDEX "Role_name_idx" ON "Role"("name");

-- CreateIndex
CREATE INDEX "Shipowner_name_idx" ON "Shipowner"("name");

-- CreateIndex
CREATE INDEX "Shipowner_code_idx" ON "Shipowner"("code");

-- CreateIndex
CREATE INDEX "Ships_name_idx" ON "Ships"("name");

-- CreateIndex
CREATE INDEX "Ships_code_idx" ON "Ships"("code");

-- CreateIndex
CREATE INDEX "ShipsType_name_idx" ON "ShipsType"("name");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");

-- CreateIndex
CREATE INDEX "User_lastName_idx" ON "User"("lastName");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Traffics" ADD CONSTRAINT "Traffics_modifiedBy_fkey" FOREIGN KEY ("modifiedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
