/*
  Warnings:

  - You are about to drop the column `priority` on the `MenuItem` table. All the data in the column will be lost.
  - Made the column `categoryId` on table `MenuItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `MenuItem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `MenuItem` DROP FOREIGN KEY `MenuItem_categoryId_fkey`;

-- DropIndex
DROP INDEX `MenuItem_categoryId_fkey` ON `MenuItem`;

-- AlterTable
ALTER TABLE `MenuItem` DROP COLUMN `priority`,
    MODIFY `categoryId` INTEGER NOT NULL,
    MODIFY `price` DECIMAL(10, 2) NOT NULL;

-- AddForeignKey
ALTER TABLE `MenuItem` ADD CONSTRAINT `MenuItem_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
