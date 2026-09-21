import type { Request, Response } from "express";
import * as categoryService from "./category.service.js";

export async function createCategory(req: Request, res: Response) {
  try {
    const restaurantId = Number(req.params.restaurantId);

    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;

    if (!currentUserId || !currentUserRole) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result = await categoryService.createCategory(
      restaurantId,
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
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getCategories(
  req: Request,
  res: Response
) {
  try {
    const restaurantId = req.query.restaurantId
      ? Number(req.query.restaurantId)
      : undefined;

    const result = await categoryService.getCategories(restaurantId);

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

export async function getCategoryById(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    const result = await categoryService.getCategoryById(id);

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

export async function updateCategory(
  req: Request,
  res: Response
) {
  try {
    const categoryId = Number(req.params.id);

    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;

    if (!currentUserId || !currentUserRole) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result = await categoryService.updateCategory(
      categoryId,
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
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function deleteCategory(
  req: Request,
  res: Response
) {
  try {
    const categoryId = Number(req.params.id);

    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;

    if (!currentUserId || !currentUserRole) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result = await categoryService.deleteCategory(
      categoryId,
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
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}