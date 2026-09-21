import { Router } from "express";
import * as ratingController from "./rating.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /ratings/restaurant/{restaurantId}:
 *   post:
 *     summary: Create restaurant rating
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Excellent food and fast delivery.
 *     responses:
 *       201:
 *         description: Rating created successfully
 *       404:
 *         description: Restaurant not found
 */
router.post(
  "/restaurant/:restaurantId",
  authenticateToken,
  ratingController.createRating
);

/**
 * @swagger
 * /ratings/restaurant/{restaurantId}:
 *   get:
 *     summary: Get restaurant ratings
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of restaurant ratings
 *       404:
 *         description: Restaurant not found
 */
router.get(
  "/restaurant/:restaurantId",
  ratingController.getRatings
);

/**
 * @swagger
 * /ratings/restaurant/{restaurantId}:
 *   patch:
 *     summary: Update restaurant rating
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: Good food, but delivery was slow.
 *     responses:
 *       200:
 *         description: Rating updated successfully
 *       404:
 *         description: Rating not found
 */
router.patch(
  "/restaurant/:restaurantId",
  authenticateToken,
  ratingController.updateRating
);

/**
 * @swagger
 * /ratings/restaurant/{restaurantId}:
 *   delete:
 *     summary: Delete restaurant rating
 *     tags: [Ratings]
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
 *         description: Rating deleted successfully
 *       404:
 *         description: Rating not found
 */
router.delete(
  "/restaurant/:restaurantId",
  authenticateToken,
  ratingController.deleteRating
);

export default router;