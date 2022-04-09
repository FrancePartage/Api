/*
  Warnings:

  - Added the required column `cover` to the `resources` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `resources` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "resources" ADD COLUMN     "cover" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
