-- CreateTable
CREATE TABLE "Traffics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEnglish" TEXT NOT NULL,
    "modifiedBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Traffics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Traffics" ADD CONSTRAINT "Traffics_modifiedBy_fkey" FOREIGN KEY ("modifiedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
