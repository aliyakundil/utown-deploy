import { Router } from "express";
import * as authController from "./auth.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import rateLimit from "express-rate-limit";

const router = Router();

const verifyCodeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many verification attempts. Please try again later.",
  },
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many password reset requests. Please try again later.",
  },
});

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many password reset attempts. Please try again later.",
  },
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Aliya
 *               phone:
 *                 type: string
 *                 example: "996556560202"
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token
 */
router.post("/refresh", authController.refresh);


/**
 * @swagger
 * /auth/verify-code:
 *   post:
 *     summary: Verify phone number using SMS code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - code
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "996556560202"
 *               code:
 *                 type: string
 *                 example: "090321"
 *     responses:
 *       200:
 *         description: Phone verified successfully
 *       400:
 *         description: Invalid or expired verification code
 */
router.post(
  "/verify-code",
  verifyCodeLimiter,
  authController.verifyCode
);

router.post("/resend-code", authController.resendCode);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "996556560202"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post("/logout", authenticateToken, authController.logout);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "996556560202"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Reset code request processed
 *       400:
 *         description: Invalid request
 *       429:
 *         description: Too many requests
 */
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  authController.forgotPassword,
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using verification code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - newPassword
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "996556560202"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               code:
 *                 type: string
 *                 pattern: '^\d{6}$'
 *                 example: "090321"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewPassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired code, or invalid request
 *       429:
 *         description: Too many reset attempts
 */
router.post(
  "/reset-password",
  resetPasswordLimiter,
  authController.resetPassword,
);

/**
 * @swagger
 * /auth/change-password:
 *   patch:
 *     summary: Change password for authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: "OldPassword123"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewPassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Current password is incorrect or request is invalid
 *       401:
 *         description: Unauthorized
 */
router.patch("/change-password", authenticateToken, authController.changePassword);


export default router;