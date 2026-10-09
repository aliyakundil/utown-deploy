import { Router } from "express";
import * as adminController from "./admin.controller.js";
import { authenticateToken, requireRoles } from "../../middleware/auth.middleware.js";

const router = Router();

router.use(authenticateToken);
router.use(requireRoles("ADMIN"));

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/users", adminController.getUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get user by id
 *     tags: [Admin]
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
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get("/users/:id", adminController.getUserById);

/**
 * @swagger
 * /admin/users:
 *   post:
 *     summary: Create user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - phone
 *             properties:
 *               username:
 *                 type: string
 *                 example: Aliya
 *               phone:
 *                 type: string
 *                 example: "996555123456"
 *               password:
 *                 type: string
 *                 description: Optional - a random password is generated if omitted
 *                 example: Password123
 *               email:
 *                 type: string
 *                 example: alia@example.com
 *               address:
 *                 type: string
 *                 example: "25 Manasa Street"
 *               role:
 *                 type: string
 *                 enum:
 *                   - CLIENT
 *                   - RESTAURATEUR
 *                   - ADMIN
 *                 example: CLIENT
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
router.post("/users", adminController.createUserByAdmin);

/**
 * @swagger
 * /admin/users/{id}:
 *   patch:
 *     summary: Update user
 *     tags: [Admin]
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
 *               username:
 *                 type: string
 *                 example: Aliya
 *               phone:
 *                 type: string
 *                 example: "996555123456"
 *               email:
 *                 type: string
 *                 example: alia@example.com
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.patch("/users/:id", adminController.patchUserByAdmin);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Admin]
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
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/users/:id", adminController.deleteUserByAdmin);

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: Get all orders across the platform
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 */
router.get("/orders", adminController.getAllOrders);

export default router;