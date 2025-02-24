/*
  Warnings:

  - Added the required column `component` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "component" TEXT NOT NULL,
ADD COLUMN     "female" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "male" INTEGER NOT NULL DEFAULT 0;
