-- AlterTable
ALTER TABLE `eventorganizer` ADD COLUMN `resetPasswordToken` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `isValid` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `resetPasswordToken` VARCHAR(191) NULL;
