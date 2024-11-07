-- AlterTable
ALTER TABLE `users` ADD COLUMN `isValid` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `resetPasswordToken` CHAR(255) NULL;
