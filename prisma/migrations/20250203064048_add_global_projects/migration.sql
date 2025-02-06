/*
  Warnings:

  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Project";

-- CreateTable
CREATE TABLE "Projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "project" TEXT NOT NULL,
    "inclusiveDates" TEXT NOT NULL,
    "activityName" TEXT NOT NULL,
    "natureOfActivity" TEXT NOT NULL,
    "numberOfHours" INTEGER NOT NULL,
    "initiatedBy" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "partneredInstitutions" TEXT NOT NULL,
    "beneficiary" TEXT NOT NULL,
    "numberOfParticipants" INTEGER NOT NULL,
    "movs" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Projects_name_key" ON "Projects"("name");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
