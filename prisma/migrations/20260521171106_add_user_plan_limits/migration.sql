-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PAID');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "humanize_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'FREE';
