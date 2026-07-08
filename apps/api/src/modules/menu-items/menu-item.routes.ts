import { Router } from "express";

import * as menuItemController from "./menu-item.controller.js";

import { authenticateToken, requireRoles } from "../../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /menu-items/category/{categoryId}:
 *   post:
 *     summary: Create menu item
 *     tags: [Menu Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
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
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cheeseburger
 *               description:
 *                 type: string
 *                 example: Beef burger with cheese
 *               price:
 *                 type: number
 *                 example: 350
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/burger.jpg
 *     responses:
 *       201:
 *         description: Menu item created successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 */
router.post(
  "/category/:categoryId",
  authenticateToken,
  requireRoles("ADMIN", "RESTAURATEUR"),
  menuItemController.createMenuItem
);

/**
 * @swagger
 * /menu-items:
 *   get:
 *     summary: Get all menu items
 *     tags: [Menu Items]
 *     responses:
 *       200:
 *         description: List of menu items
 */
router.get(
  "/",
  menuItemController.getMenuItems
);

/**
 * @swagger
 * /menu-items/{id}:
 *   get:
 *     summary: Get menu item by id
 *     tags: [Menu Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu item details
 *       404:
 *         description: Menu item not found
 */
router.get(
  "/:id",
  menuItemController.getMenuItemById
);

/**
 * @swagger
 * /menu-items/{id}:
 *   patch:
 *     summary: Update menu item
 *     tags: [Menu Items]
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
 *                 example: Cheeseburger
 *               description:
 *                 type: string
 *                 example: Beef burger with cheese
 *               price:
 *                 type: number
 *                 example: 350
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/burger.jpg
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Menu item not found
 */
router.patch(
  "/:id",
  authenticateToken,
  requireRoles("ADMIN", "RESTAURATEUR"),
  menuItemController.updateMenuItem
);

/**
 * @swagger
 * /menu-items/{id}:
 *   delete:
 *     summary: Delete menu item
 *     tags: [Menu Items]
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
 *         description: Menu item deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Menu item not found
 */
router.delete(
  "/:id",
  authenticateToken,
  requireRoles("ADMIN", "RESTAURATEUR"),
  menuItemController.deleteMenuItem
);

export default router;