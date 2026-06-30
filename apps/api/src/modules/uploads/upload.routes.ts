import { Router } from "express";

import * as uploadController from "./upload.controller.js";

import { upload } from "./upload.middleware.js";

import {
  authenticateToken,
} from "../../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/",
  authenticateToken,
  upload.single("file"),
  uploadController.uploadFile
);

router.get(
  "/",
  authenticateToken,
  uploadController.getUploads
);

router.delete(
  "/:id",
  authenticateToken,
  uploadController.deleteUpload
);

export default router;