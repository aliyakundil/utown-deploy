import { UserRole } from "@prisma/client";
import { prisma } from "../../db/prisma.js";

import type { CreateMenuItemDto, UpdateMenuItemDto } from "./menu-item.types.js";
import { validateCreateMenuItem, validateUpdateMenuItem } from "./menu-item.validation.js";

export async function createMenuItem(
  categoryId: number,
  currentUserId: number,
  currentUserRole: UserRole,
  data: CreateMenuItemDto
) {
  const validatedData = validateCreateMenuItem(data);

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
    include: {
      restaurant: true,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const canManage =
    currentUserRole === UserRole.ADMIN ||
    category.restaurant.ownerId === currentUserId;

  if (!canManage) {
    throw new Error("Forbidden");
  }

  return prisma.menuItem.create({
    data: {
      restaurantId: category.restaurantId,
      categoryId: category.id,

      name: validatedData.name,

      ...(validatedData.description !== undefined && {
        description: validatedData.description,
      }),

      price: validatedData.price,

      ...(validatedData.imageUrl !== undefined && {
        imageUrl: validatedData.imageUrl,
      }),
    },
  });
}

export async function getMenuItem(restaurantId?: number) {
  return prisma.menuItem.findMany({
    ...(restaurantId !== undefined && { where: { restaurantId } }),
    orderBy: { id: "desc" },
    include: {
      category: true,
      restaurant: true,
    },
  });
}

export async function getMenuItemById(id: number) {
  const menuItem = await prisma.menuItem.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      restaurant: true,
    },
  });

  if (!menuItem) {
    throw new Error("Menu item not found");
  }

  return menuItem;
}

export async function updateMenuItem(
  menuItemId: number,
  currentUserId: number,
  currentUserRole: UserRole,
  data: UpdateMenuItemDto
) {
  const validatedData = validateUpdateMenuItem(data);

  const menuItem = await prisma.menuItem.findUnique({
    where: {
      id: menuItemId,
    },
    include: {
      restaurant: true,
    },
  });

  if (!menuItem) {
    throw new Error("Menu item not found");
  }

  const canManage =
    currentUserRole === UserRole.ADMIN ||
    menuItem.restaurant.ownerId === currentUserId;

  if (!canManage) {
    throw new Error("Forbidden");
  }

  if (validatedData.categoryId !== undefined) {
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category || category.restaurantId !== menuItem.restaurantId) {
      throw new Error("Invalid category for this restaurant");
    }
  }

  return prisma.menuItem.update({
    where: {
      id: menuItemId,
    },
    data: validatedData,
  });
}

export async function deleteMenuItem(
  menuItemId: number,
  currentUserId: number,
  currentUserRole: UserRole
) {
  const menuItem = await prisma.menuItem.findUnique({
    where: {
      id: menuItemId,
    },
    include: {
      restaurant: true,
    },
  });

  if (!menuItem) {
    throw new Error("Menu item not found");
  }

  const canManage =
    currentUserRole === UserRole.ADMIN ||
    menuItem.restaurant.ownerId === currentUserId;

  if (!canManage) {
    throw new Error("Forbidden");
  }

  await prisma.menuItem.delete({
    where: {
      id: menuItemId,
    },
  });

  return {
    success: true,
  };
}