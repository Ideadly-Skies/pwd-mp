/*
  Warnings:

  - The primary key for the `transactiondetails` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `transactions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `transactionstatus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `price` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `transactiondetails` DROP FOREIGN KEY `transactiondetails_transactionId_fkey`;

-- DropForeignKey
ALTER TABLE `transactionstatus` DROP FOREIGN KEY `transactionstatus_transactionId_fkey`;

-- AlterTable
ALTER TABLE `events` ADD COLUMN `price` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `transactiondetails` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `transactionId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `transactions` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `transactionstatus` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `transactionId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `transactiondetails` ADD CONSTRAINT `transactiondetails_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `transactions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactionstatus` ADD CONSTRAINT `transactionstatus_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `transactions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
