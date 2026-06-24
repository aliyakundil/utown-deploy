import { Router } from "express";

import * as favoriteController from "./favorite.controller.js";

import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/",
  authenticateToken,
  favoriteController.addFavorite
);

router.get(
  "/",
  authenticateToken,
  favoriteController.getFavorites
);

router.delete(
  "/:restaurantId",
  authenticateToken,
  favoriteController.removeFavorite
);

export default router;