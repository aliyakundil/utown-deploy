-- AlterTable
ALTER TABLE `VerificationCode` MODIFY `phone` VARCHAR(191) NULL;
ALTER TABLE `VerificationCode` ADD COLUMN `email` VARCHAR(191) NULL;
