import type { Request, Response } from "express";
import * as restaurantService from "./restaurant.service.js";

export async function createRestaurant(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result = await restaurantService.createRestaurant(userId, req.body);

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getRestaurants(req: Request, res: Response) {
  try {
    const result = await restaurantService.getRestaurants(req.query);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getMyRestaurants(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result = await restaurantService.getMyRestaurants(userId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getRestaurantById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid restaurant id",
      });
    }

    const result = await restaurantService.getRestaurantById(id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function updateRestaurant(req: Request, res: Response) {
  try {
    const restaurantId = Number(req.params.id);
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (Number.isNaN(restaurantId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid restaurant id",
      });
    }

    if (!userId || !userRole) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result = await restaurantService.updateRestaurant(
      restaurantId,
      userId,
      userRole,
      req.body
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    return res.status(message === "Forbidden" ? 403 : 400).json({
      success: false,
      error: message,
    });
  }
}

export async function deleteRestaurant(req: Request, res: Response) {
  try {
    const restaurantId = Number(req.params.id);
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (Number.isNaN(restaurantId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid restaurant id",
      });
    }

    if (!userId || !userRole) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result = await restaurantService.deleteRestaurant(
      restaurantId,
      userId,
      userRole
    );

    return res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    return res.status(message === "Forbidden" ? 403 : 400).json({
      success: false,
      error: message,
    });
  }
}
