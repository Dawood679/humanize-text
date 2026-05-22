/*
  Warnings:

  - You are about to drop the column `text` on the `texts` table. All the data in the column will be lost.
  - Added the required column `input` to the `texts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `output` to the `texts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "texts" DROP COLUMN "text",
ADD COLUMN     "input" TEXT NOT NULL,
ADD COLUMN     "output" TEXT NOT NULL;
