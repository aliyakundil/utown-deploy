import { Router } from "express";

import * as paymentController from "./payment.controller.js";

import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/order/:orderId",
  authenticateToken,
  paymentController.createPayment
);

router.get(
  "/order/:orderId",
  authenticateToken,
  paymentController.getPayment
);

export default router;