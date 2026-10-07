import type { Request, Response } from "express";
import * as orderService from "./order.service.js";

export async function createOrder(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result = await orderService.createOrder(
      userId,
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

export async function getMyOrders(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result =
      await orderService.getMyOrders(userId);

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

export async function getRestaurantOrders(
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

    const restaurantId = Number(req.params.restaurantId);

    if (Number.isNaN(restaurantId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid restaurant id",
      });
    }

    const result = await orderService.getRestaurantOrders(
      restaurantId,
      currentUserId,
      currentUserRole
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

export async function getOrderById(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result =
      await orderService.getOrderById(
        Number(req.params.id),
        userId
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

export async function updateOrderStatus(
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
      await orderService.updateOrderStatus(
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

export async function cancelOrder(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result =
      await orderService.cancelOrder(
        Number(req.params.id),
        userId
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