import { Router } from "express";

import * as cartController from "./cart.controller.js";

import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/items",
  authenticateToken,
  cartController.addToCart
);

router.patch(
  "/items/:id",
  authenticateToken,
  cartController.updateCartItem
);

router.delete(
  "/items/:id",
  authenticateToken,
  cartController.removeCartItem
);

router.delete(
  "/",
  authenticateToken,
  cartController.clearCart
);

export default router;