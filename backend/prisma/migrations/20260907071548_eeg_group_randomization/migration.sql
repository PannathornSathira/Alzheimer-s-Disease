-- CreateEnum
CREATE TYPE "EEGGroup" AS ENUM ('SEA', 'NO_SEA');

-- CreateEnum
CREATE TYPE "AllocationCode" AS ENUM ('A', 'B');

-- CreateTable
CREATE TABLE "Hospital" (
    "id" SERIAL NOT NULL,
    "prefix" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" UUID NOT NULL,
    "hn" TEXT NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrialSession" (
    "id" UUID NOT NULL,
    "trialSystemId" TEXT NOT NULL,
    "patientId" UUID NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "currentStatus" TEXT NOT NULL DEFAULT 'REGISTERED',
    "registrationTimestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inclusionPageTimestamp" TIMESTAMPTZ,
    "exclusionPageTimestamp" TIMESTAMPTZ,
    "pauseTimestamp" TIMESTAMPTZ,
    "resumeTimestamp" TIMESTAMPTZ,
    "eegGroupTimestamp" TIMESTAMPTZ,
    "randomizationTimestamp" TIMESTAMPTZ,
    "inclusionPassed" BOOLEAN,
    "exclusionPassed" BOOLEAN,
    "failedReason" TEXT,
    "eegGroup" "EEGGroup",
    "allocationCode" "AllocationCode",
    "allocationSequence" INTEGER,

    CONSTRAINT "TrialSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_prefix_key" ON "Hospital"("prefix");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_hospitalId_hn_key" ON "Patient"("hospitalId", "hn");

-- CreateIndex
CREATE UNIQUE INDEX "TrialSession_trialSystemId_key" ON "TrialSession"("trialSystemId");

-- CreateIndex
CREATE UNIQUE INDEX "TrialSession_eegGroup_allocationSequence_key" ON "TrialSession"("eegGroup", "allocationSequence");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrialSession" ADD CONSTRAINT "TrialSession_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrialSession" ADD CONSTRAINT "TrialSession_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrialSession" ADD CONSTRAINT "TrialSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
