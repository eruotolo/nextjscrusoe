/*
  Warnings:

  - A unique constraint covering the columns `[creditInfoId]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Partner_creditInfoId_key" ON "Partner"("creditInfoId");
