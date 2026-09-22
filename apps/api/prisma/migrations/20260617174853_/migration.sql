/*
  Warnings:

  - A unique constraint covering the columns `[cartId,menuItemId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,restaurantId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,restaurantId]` on the table `RestaurantRating` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemName` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `customerPhone` VARCHAR(191) NULL,
    ADD COLUMN `paymentMethod` ENUM('CASH', 'CARD') NOT NULL DEFAULT 'CASH',
    ADD COLUMN `paymentStatus` ENUM('PENDING', 'PAID', 'FAILED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `itemName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Restaurant` MODIFY `status` ENUM('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN';

-- CreateIndex
CREATE UNIQUE INDEX `CartItem_cartId_menuItemId_key` ON `CartItem`(`cartId`, `menuItemId`);

-- CreateIndex
CREATE UNIQUE INDEX `Favorite_userId_restaurantId_key` ON `Favorite`(`userId`, `restaurantId`);

-- CreateIndex
CREATE UNIQUE INDEX `RestaurantRating_userId_restaurantId_key` ON `RestaurantRating`(`userId`, `restaurantId`);
