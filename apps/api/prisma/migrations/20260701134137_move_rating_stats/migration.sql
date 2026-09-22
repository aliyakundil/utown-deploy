/*
  Warnings:

  - You are about to drop the column `averageRating` on the `RestaurantRating` table. All the data in the column will be lost.
  - You are about to drop the column `ratingsCount` on the `RestaurantRating` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Restaurant` ADD COLUMN `averageRating` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `ratingsCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `RestaurantRating` DROP COLUMN `averageRating`,
    DROP COLUMN `ratingsCount`;
