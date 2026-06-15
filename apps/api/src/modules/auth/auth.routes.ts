import { Router } from "express";
import * as authController from "./auth.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/register", authController.register);
router.post("/refresh", authController.refresh);
router.post("/login", authController.login);
router.post("/logout", authMiddleware, authController.logout);

export default router;