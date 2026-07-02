import { Router } from "express";
import * as notificationController from "./notification.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/",
  authenticateToken,
  notificationController.getNotifications
);

router.patch(
  "/:notificationId/read",
  authenticateToken,
  notificationController.markAsRead
);

router.patch(
  "/read-all",
  authenticateToken,
  notificationController.markAllAsRead
);

router.delete(
  "/:notificationId",
  authenticateToken,
  notificationController.deleteNotification
);

export default router;