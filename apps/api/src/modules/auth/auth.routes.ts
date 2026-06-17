import { Router } from "express";
import * as authController from "./auth.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/register", authController.register);
router.post("/refresh", authController.refresh);
router.post("/login", authController.login);
router.post("/logout", authenticateToken, authController.logout);
router.get("/me", authenticateToken, authController.me);
export default router;