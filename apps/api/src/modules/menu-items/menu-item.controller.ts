import type { Request, Response } from "express";
import * as menuItemService from "./menu-item.service.js";

export async function createMenuItem(
  req: Request,
  res: Response
) {
  try {
    const categoryId = Number(req.params.categoryId);

    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;

    if (!currentUserId || !currentUserRole) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result = await menuItemService.createMenuItem(
      categoryId,
      currentUserId,
      currentUserRole,
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


export async function getMenuItems(
  req: Request,
  res: Response
) {
  try {
    const restaurantId = req.query.restaurantId
      ? Number(req.query.restaurantId)
      : undefined;

    const result = await menuItemService.getMenuItem(restaurantId);

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

export async function getMenuItemById(
  req: Request,
  res: Response
) {
  try {
    const result =
      await menuItemService.getMenuItemById(
        Number(req.params.id)
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
}

export async function updateMenuItem(
  req: Request,
  res: Response
) {
  try {
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;

    if (!currentUserId || !currentUserRole) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result =
      await menuItemService.updateMenuItem(
        Number(req.params.id),
        currentUserId,
        currentUserRole,
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

export async function deleteMenuItem(
  req: Request,
  res: Response
) {
  try {
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;

    if (!currentUserId || !currentUserRole) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result =
      await menuItemService.deleteMenuItem(
        Number(req.params.id),
        currentUserId,
        currentUserRole
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