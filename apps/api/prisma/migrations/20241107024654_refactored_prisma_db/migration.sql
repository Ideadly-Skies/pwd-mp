/*
  Warnings:

  - You are about to drop the column `resetPasswordToken` on the `eventorganizer` table. All the data in the column will be lost.
  - You are about to alter the column `type` on the `events` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(191)`.
  - You are about to alter the column `status` on the `transactionstatus` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - You are about to drop the column `isValid` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordToken` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `eventorganizer` DROP COLUMN `resetPasswordToken`;

-- AlterTable
ALTER TABLE `events` MODIFY `type` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `transactionstatus` MODIFY `status` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `isValid`,
    DROP COLUMN `resetPasswordToken`;
