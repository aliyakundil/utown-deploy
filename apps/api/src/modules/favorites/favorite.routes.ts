import { Router } from "express";

import * as favoriteController from "./favorite.controller.js";

import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Add restaurant to favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurantId
 *             properties:
 *               restaurantId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Restaurant added to favorites
 *       404:
 *         description: Restaurant not found
 */
router.post(
  "/",
  authenticateToken,
  favoriteController.addFavorite
);

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Get favorite restaurants
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite restaurants
 */
router.get(
  "/",
  authenticateToken,
  favoriteController.getFavorites
);

/**
 * @swagger
 * /favorites/{restaurantId}:
 *   delete:
 *     summary: Remove restaurant from favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurant removed from favorites
 *       404:
 *         description: Favorite not found
 */
router.delete(
  "/:restaurantId",
  authenticateToken,
  favoriteController.removeFavorite
);

export default router;