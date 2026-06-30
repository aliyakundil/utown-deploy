import { Router } from "express";
import * as ratingController from "./rating.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";
console.log("RATINGS ROUTER LOADED");
const router = Router();

router.get("/test", (req, res) => {
  res.json({ ok: true });
});

router.post("/test", (req, res) => {
  res.json({ ok: true });
});

router.post(
  "/restaurant/:restaurantId",
  authenticateToken,
  ratingController.createRating
);

router.get(
  "/restaurant/:restaurantId",
  ratingController.getRatings
);

router.patch(
  "/restaurant/:restaurantId",
  authenticateToken,
  ratingController.updateRating
);

router.delete(
  "/restaurant/:restaurantId",
  authenticateToken,
  ratingController.deleteRating
);

export default router;