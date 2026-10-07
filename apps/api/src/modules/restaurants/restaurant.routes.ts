import { Router } from "express";
import * as restaurantController from "./restaurant.controller.js";
import { authenticateToken, requireRoles } from "../../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of restaurants
 */
router.get("/", restaurantController.getRestaurants);

/**
 * @swagger
 * /restaurants/mine:
 *   get:
 *     summary: Get restaurants owned by the current user
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of the current user's restaurants
 */
router.get(
  "/mine",
  authenticateToken,
  requireRoles("ADMIN", "RESTAURATEUR"),
  restaurantController.getMyRestaurants
);

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     summary: Get restaurant by id
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurant details
 *       404:
 *         description: Restaurant not found
 */
router.get("/:id", restaurantController.getRestaurantById);

/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Create restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Seoul BBQ
 *               description:
 *                 type: string
 *                 example: Traditional Korean barbecue restaurant
 *               address:
 *                 type: string
 *                 example: 25 Manasa Street
 *               phone:
 *                 type: string
 *                 example: "996555123456"
 *               status:
 *                 type: string
 *                 enum:
 *                   - OPEN
 *                   - CLOSED
 *                 example: OPEN
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/restaurant.jpg
 *               minimumOrder:
 *                 type: number
 *                 example: 500
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *       403:
 *         description: Forbidden
 */
router.post("/", authenticateToken, requireRoles("ADMIN", "RESTAURATEUR"), restaurantController.createRestaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   patch:
 *     summary: Update restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Seoul BBQ
 *               description:
 *                 type: string
 *                 example: Traditional Korean barbecue restaurant
 *               address:
 *                 type: string
 *                 example: 25 Manasa Street
 *               phone:
 *                 type: string
 *                 example: "996555123456"
 *               status:
 *                 type: string
 *                 enum:
 *                   - OPEN
 *                   - CLOSED
 *                 example: OPEN
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/restaurant.jpg
 *               minimumOrder:
 *                 type: number
 *                 example: 500
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Restaurant not found
 */
router.patch("/:id", authenticateToken, requireRoles("ADMIN", "RESTAURATEUR"), restaurantController.updateRestaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     summary: Delete restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Restaurant not found
 */
router.delete("/:id", authenticateToken, requireRoles("ADMIN", "RESTAURATEUR"), restaurantController.deleteRestaurant);

export default router;
