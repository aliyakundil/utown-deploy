/*
  Warnings:

  - You are about to drop the column `averageRating` on the `restaurantrating` table. All the data in the column will be lost.
  - You are about to drop the column `ratingsCount` on the `restaurantrating` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `restaurant` ADD COLUMN `averageRating` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `ratingsCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `restaurantrating` DROP COLUMN `averageRating`,
    DROP COLUMN `ratingsCount`;
