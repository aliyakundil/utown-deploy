import { Router } from "express";
import * as userController from "./user.controller.js";

import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/me",
  authenticateToken,
  userController.getProfile
);

router.patch(
  "/me",
  authenticateToken,
  userController.updateProfile
);

router.delete(
  "/me",
  authenticateToken,
  userController.deleteProfile
);

export default router;