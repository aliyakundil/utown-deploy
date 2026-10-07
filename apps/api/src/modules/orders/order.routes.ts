import { Router } from "express";

import * as orderController from "./order.controller.js";

import { authenticateToken, requireRoles } from "../../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deliveryAddress:
 *                 type: string
 *                 example: Bishkek, Manasa 25
 *               customerNote:
 *                 type: string
 *                 example: Please don't ring the doorbell.
 *               customerPhone:
 *                 type: string
 *                 example: "996555123456"
 *               paymentMethod:
 *                 type: string
 *                 enum:
 *                   - CASH
 *                   - CARD
 *                 example: CASH
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid request
 */
router.post(
  "/",
  authenticateToken,
  orderController.createOrder
);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get current user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 */
router.get(
  "/",
  authenticateToken,
  orderController.getMyOrders
);

/**
 * @swagger
 * /orders/restaurant/{restaurantId}:
 *   get:
 *     summary: Get orders for a restaurant (owner/admin only)
 *     tags: [Orders]
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
 *         description: List of the restaurant's orders
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Restaurant not found
 */
router.get(
  "/restaurant/:restaurantId",
  authenticateToken,
  requireRoles("ADMIN", "RESTAURATEUR"),
  orderController.getRestaurantOrders
);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by id
 *     tags: [Orders]
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
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get(
  "/:id",
  authenticateToken,
  orderController.getOrderById
);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - ACCEPTED
 *                   - PREPARING
 *                   - READY
 *                   - COMPLETED
 *                   - CANCELLED
 *                 example: ACCEPTED
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
router.patch(
  "/:id/status",
  authenticateToken,
  requireRoles("ADMIN", "RESTAURATEUR"),
  orderController.updateOrderStatus
);

/**
 * @swagger
 * /orders/{id}/cancel:
 *   patch:
 *     summary: Cancel order
 *     tags: [Orders]
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
 *         description: Order cancelled successfully
 *       404:
 *         description: Order not found
 */
router.patch(
  "/:id/cancel",
  authenticateToken,
  orderController.cancelOrder
);

export default router;