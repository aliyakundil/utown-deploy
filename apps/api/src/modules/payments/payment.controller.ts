import type { Request, Response } from "express";
import * as paymentService from "./payment.service.js";

export async function createPayment(
  req: Request,
  res: Response
) {
  try {
    const orderId = Number(req.params.orderId);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result =
      await paymentService.createPayment(
        orderId,
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

export async function getPayment(
  req: Request,
  res: Response
) {
  try {
    const orderId = Number(req.params.orderId);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result =
      await paymentService.getPayment(
        orderId,
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