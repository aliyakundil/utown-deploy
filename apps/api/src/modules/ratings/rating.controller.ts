import type { Request, Response } from "express";
import * as ratingService from "./rating.service.js";

export async function createRating(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user?.id;
    const restaurantId = Number(req.params.restaurantId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result = await ratingService.createRating(
      userId,
      restaurantId,
      req.body
    );

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
}

export async function getRatings(
  req: Request,
  res: Response
) {
  try {
    const restaurantId = Number(
      req.params.restaurantId
    );

    const result =
      await ratingService.getRatings(
        restaurantId
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
}

export async function updateRating(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user?.id;
    const restaurantId = Number(
      req.params.restaurantId
    );

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result =
      await ratingService.updateRating(
        userId,
        restaurantId,
        req.body
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
}

export async function deleteRating(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user?.id;
    const restaurantId = Number(
      req.params.restaurantId
    );

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result =
      await ratingService.deleteRating(
        userId,
        restaurantId
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
}