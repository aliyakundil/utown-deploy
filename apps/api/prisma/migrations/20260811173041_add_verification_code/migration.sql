-- AlterTable
ALTER TABLE `User` ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `VerificationCode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `phone` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
