import type { Request, Response, NextFunction } from "express";
import * as adminService from "./admin.service.js";

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await adminService.getUsers(req.query);

    res.status(200).json({
      success: true,
      data: {
        users: result.users,
        meta: result.meta,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Invalid user id",
      });
    }

    const user = await adminService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function createUserByAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await adminService.createUserByAdmin(req.body);

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function updateUserByAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Invalid user id",
      });
    }

    const result = await adminService.updateUserByAdmin(id, req.body);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function patchUserByAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid user id",
      });
    }

    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({
        success: false,
        error: "Body cannot be empty",
      });
    }

    const result = await adminService.patchUserByAdmin(id, body);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await adminService.getAllOrders(req.query);

    res.status(200).json({
      success: true,
      data: {
        orders: result.orders,
        meta: result.meta,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUserByAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid user id",
      });
    }

    const deleted = await adminService.deleteUserByAdmin(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}