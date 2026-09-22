-- AlterTable
ALTER TABLE `Restaurant` ADD COLUMN `Category` VARCHAR(191) NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `deliveryArea` VARCHAR(191) NULL,
    ADD COLUMN `workingHours` JSON NULL;
