/*
  Warnings:

  - You are about to drop the column `createdAt` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the `transactiondetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactionstatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "transactiondetails" DROP CONSTRAINT "transactiondetails_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "transactiondetails" DROP CONSTRAINT "transactiondetails_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "transactionstatus" DROP CONSTRAINT "transactionstatus_transactionId_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "createdAt",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- DropTable
DROP TABLE "transactiondetails";

-- DropTable
DROP TABLE "transactionstatus";
