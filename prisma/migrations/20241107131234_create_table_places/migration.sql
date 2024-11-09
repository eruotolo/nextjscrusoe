-- CreateTable
CREATE TABLE "Places" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "codeCountry" TEXT,
    "codeCity" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Places_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Places_name_idx" ON "Places"("name");

-- CreateIndex
CREATE INDEX "Places_codeCountry_idx" ON "Places"("codeCountry");

-- CreateIndex
CREATE INDEX "Places_codeCity_idx" ON "Places"("codeCity");

-- AddForeignKey
ALTER TABLE "Places" ADD CONSTRAINT "Places_codeCountry_fkey" FOREIGN KEY ("codeCountry") REFERENCES "Country"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Places" ADD CONSTRAINT "Places_codeCity_fkey" FOREIGN KEY ("codeCity") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;
