import { Router } from "express";

import * as paymentController from "./payment.controller.js";

import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /payments/order/{orderId}:
 *   post:
 *     summary: Create payment for order
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
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
 *               - paymentMethod
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum:
 *                   - CASH
 *                   - CARD
 *                 example: CARD
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Order not found
 */
router.post(
  "/order/:orderId",
  authenticateToken,
  paymentController.createPayment
);

/**
 * @swagger
 * /payments/order/{orderId}:
 *   get:
 *     summary: Get payment information for order
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment information
 *       404:
 *         description: Order not found
 */
router.get(
  "/order/:orderId",
  authenticateToken,
  paymentController.getPayment
);

export default router;