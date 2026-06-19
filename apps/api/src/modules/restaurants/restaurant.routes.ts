import { Router } from "express";
import * as restaurantController from "./restaurant.controller.js";
import { authenticateToken, requireRoles } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", restaurantController.getRestaurants);
router.get("/:id", restaurantController.getRestaurantById);

router.post("/", authenticateToken, requireRoles("ADMIN", "RESTAURATEUR"), restaurantController.createRestaurant);
router.patch("/:id", authenticateToken, requireRoles("ADMIN", "RESTAURATEUR"), restaurantController.updateRestaurant);
router.delete("/:id", authenticateToken, requireRoles("ADMIN", "RESTAURATEUR"), restaurantController.deleteRestaurant);

export default router;
