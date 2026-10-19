CREATE TABLE `VerificationAttempt` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `phone` VARCHAR(191) NOT NULL,
    `failedAttempts` INTEGER NOT NULL DEFAULT 0,
    `blockedUntil` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationAttempt_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;