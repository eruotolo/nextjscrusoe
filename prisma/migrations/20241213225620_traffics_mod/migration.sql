-- DropForeignKey
ALTER TABLE "Traffics" DROP CONSTRAINT "Traffics_modifiedBy_fkey";

-- AlterTable
ALTER TABLE "Traffics" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "nameEnglish" DROP NOT NULL,
ALTER COLUMN "modifiedBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Traffics" ADD CONSTRAINT "Traffics_modifiedBy_fkey" FOREIGN KEY ("modifiedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
