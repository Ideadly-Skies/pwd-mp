/*
  Warnings:

  - You are about to drop the column `createdAt` on the `eventtickets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "eventorganizer" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "eventtickets" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "refferaldiscounts" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "refferalpoints" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
