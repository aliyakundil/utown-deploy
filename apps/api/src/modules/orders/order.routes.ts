import { Router } from "express";

import * as orderController from "./order.controller.js";

import { authenticateToken, requireRoles } from "../../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/",
  authenticateToken,
  orderController.createOrder
);

router.get(
  "/",
  authenticateToken,
  orderController.getMyOrders
);

router.get(
  "/:id",
  authenticateToken,
  orderController.getOrderById
);

router.patch(
  "/:id/status",
  authenticateToken,
  requireRoles("ADMIN", "RESTAURATEUR"),
  orderController.updateOrderStatus
);

router.patch(
  "/:id/cancel",
  authenticateToken,
  orderController.cancelOrder
);

export default router;