/*
  Warnings:

  - You are about to drop the column `category` on the `restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryArea` on the `restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `workingHours` on the `restaurant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `menuitem` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `priority` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `restaurant` DROP COLUMN `category`,
    DROP COLUMN `city`,
    DROP COLUMN `deliveryArea`,
    DROP COLUMN `workingHours`;

-- CreateTable
CREATE TABLE `MenuItemOption` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `menuItemId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `extraPrice` DECIMAL(10, 2) NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MenuItemOption` ADD CONSTRAINT `MenuItemOption_menuItemId_fkey` FOREIGN KEY (`menuItemId`) REFERENCES `MenuItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
