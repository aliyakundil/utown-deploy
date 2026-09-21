import { Router } from "express";
import * as categoryController from "./category.controller.js";
import { authenticateToken, requireRoles } from "../../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /categories/restaurant/{restaurantId}:
 *   post:
 *     summary: Create category
 *     tags: [Categories]
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Burgers
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/category.jpg
 *               priority:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Category created successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Restaurant not found
 */
router.post(
  "/restaurant/:restaurantId",
  authenticateToken,
  requireRoles("ADMIN", "RESTAURATEUR"),
  categoryController.createCategory
);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/", categoryController.getCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by id
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 */
router.get("/:id", categoryController.getCategoryById);

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Update category
 *     tags: [Categories]
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
 *                 example: Burgers
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/category.jpg
 *               priority:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 */
router.patch(
  "/:id",
  authenticateToken,
  requireRoles("ADMIN", "RESTAURATEUR"),
  categoryController.updateCategory
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
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
 *         description: Category deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 */
router.delete(
  "/:id",
  authenticateToken,
  requireRoles("ADMIN", "RESTAURATEUR"),
  categoryController.deleteCategory
);

export default router;
