/*
  Warnings:

  - You are about to drop the column `priority` on the `menuitem` table. All the data in the column will be lost.
  - Made the column `categoryId` on table `menuitem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `menuitem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `menuitem` DROP FOREIGN KEY `MenuItem_categoryId_fkey`;

-- DropIndex
DROP INDEX `MenuItem_categoryId_fkey` ON `menuitem`;

-- AlterTable
ALTER TABLE `menuitem` DROP COLUMN `priority`,
    MODIFY `categoryId` INTEGER NOT NULL,
    MODIFY `price` DECIMAL(10, 2) NOT NULL;

-- AddForeignKey
ALTER TABLE `MenuItem` ADD CONSTRAINT `MenuItem_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
