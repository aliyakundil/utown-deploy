import { Router } from "express";

import * as menuItemController from "./menu-item.controller.js";

import { authenticateToken, requireRoles } from "../../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/category/:categoryId",
  authenticateToken,
  requireRoles("ADMIN", "RESTAURATEUR"),
  menuItemController.createMenuItem
);

router.get(
  "/",
  menuItemController.getMenuItems
);

router.get(
  "/:id",
  menuItemController.getMenuItemById
);

router.patch(
  "/:id",
  authenticateToken,
  requireRoles("ADMIN", "RESTAURATEUR"),
  menuItemController.updateMenuItem
);

router.delete(
  "/:id",
  authenticateToken,
  requireRoles("ADMIN", "RESTAURATEUR"),
  menuItemController.deleteMenuItem
);

export default router;