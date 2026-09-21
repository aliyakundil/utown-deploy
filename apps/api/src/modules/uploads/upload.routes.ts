import { Router } from "express";

import * as uploadController from "./upload.controller.js";

import { upload } from "./upload.middleware.js";

import {
  authenticateToken,
} from "../../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /uploads:
 *   post:
 *     summary: Upload a file
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: Invalid file
 */
router.post(
  "/",
  authenticateToken,
  upload.single("file"),
  uploadController.uploadFile
);

/**
 * @swagger
 * /uploads:
 *   get:
 *     summary: Get uploaded files
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of uploaded files
 */
router.get(
  "/",
  authenticateToken,
  uploadController.getUploads
);

/**
 * @swagger
 * /uploads/{id}:
 *   delete:
 *     summary: Delete uploaded file
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File not found
 */
router.delete(
  "/:id",
  authenticateToken,
  uploadController.deleteUpload
);

export default router;