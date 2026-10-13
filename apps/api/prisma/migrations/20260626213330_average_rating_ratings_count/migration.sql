-- AlterTable
ALTER TABLE `RestaurantRating` ADD COLUMN `averageRating` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `ratingsCount` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX `RestaurantRating_userId_idx` ON `RestaurantRating`(`userId`);

-- RenameIndex
ALTER TABLE `RestaurantRating` RENAME INDEX `RestaurantRating_restaurantId_fkey` TO `RestaurantRating_restaurantId_idx`;
