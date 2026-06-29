import { Router } from "express";
import * as categoryController from "./category.controller.js";
import { authenticateToken, requireRoles } from "../../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/restaurant/:restaurantId",
  authenticateToken,
  requireRoles("ADMIN", "RESTAURATEUR"),
  categoryController.createCategory
);

router.get("/", categoryController.getCategories);

router.get("/:id", categoryController.getCategoryById);

router.patch(
  "/:id",
  authenticateToken,
  requireRoles("ADMIN", "RESTAURATEUR"),
  categoryController.updateCategory
);

router.delete(
  "/:id",
  authenticateToken,
  requireRoles("ADMIN", "RESTAURATEUR"),
  categoryController.deleteCategory
);

export default router;
