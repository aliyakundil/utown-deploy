import { Router } from "express";
import * as adminController from "./admin.controller.js";
import { authenticateToken, requireRole } from "../../middleware/auth.middleware.js";

const router = Router();

router.use(authenticateToken);
router.use(requireRole("ADMIN"));

router.get("/users", adminController.getUsers);
router.get("/users/:id", adminController.getUserById);
router.post("/users", adminController.createUserByAdmin);
router.patch("/users/:id", adminController.patchUserByAdmin);
router.delete("/users/:id", adminController.deleteUserByAdmin);

export default router;