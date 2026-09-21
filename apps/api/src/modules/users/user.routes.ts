import { Router } from "express";
import * as userController from "./user.controller.js";

import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 */
router.get(
  "/me",
  authenticateToken,
  userController.getProfile
);

/**
 * @swagger
 * /auth/me:
 *   patch:
 *     summary: Update current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Aliya
 *               phone:
 *                 type: string
 *                 example: "996556560202"
 *               email:
 *                 type: string
 *                 example: alia@example.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 */
router.patch(
  "/me",
  authenticateToken,
  userController.updateProfile
);

/**
 * @swagger
 * /auth/me:
 *   delete:
 *     summary: Delete current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete(
  "/me",
  authenticateToken,
  userController.deleteProfile
);

export default router;