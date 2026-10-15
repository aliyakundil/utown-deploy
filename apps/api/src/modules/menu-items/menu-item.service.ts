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

  let priority = validatedData.priority;

  if (priority === undefined) {
    const lastItem = await prisma.menuItem.findFirst({
      where: { categoryId },
      orderBy: { priority: "desc" },
    });

    priority = (lastItem?.priority ?? -1) + 1;
  }

  return prisma.menuItem.create({
    data: {
      restaurantId: category.restaurantId,
      categoryId: category.id,

      name: validatedData.name,
      priority,

      ...(validatedData.description !== undefined && {
        description: validatedData.description,
      }),

      price: validatedData.price,

      ...(validatedData.imageUrl !== undefined && {
        imageUrl: validatedData.imageUrl,
      }),

      ...(validatedData.options && {
        options: {
          create: validatedData.options,
        },
      }),
    },
    include: {
      options: true,
    },
  });
}

export async function getMenuItem(restaurantId?: number) {
  return prisma.menuItem.findMany({
    where: {
      isDeleted: false,
      ...(restaurantId !== undefined && { restaurantId }),
    },
    orderBy: { priority: "asc" },
    include: {
      category: true,
      restaurant: true,
      options: true,
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
      options: true,
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

  const { options, ...rest } = validatedData;

  if (options !== undefined) {
    await prisma.menuItemOption.deleteMany({
      where: { menuItemId },
    });
  }

  return prisma.menuItem.update({
    where: {
      id: menuItemId,
    },
    data: {
      ...rest,
      ...(options !== undefined && {
        options: {
          create: options,
        },
      }),
    },
    include: {
      options: true,
    },
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

  await prisma.menuItem.update({
    where: {
      id: menuItemId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return {
    success: true,
  };
}

export async function restoreMenuItem(
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

  return prisma.menuItem.update({
    where: {
      id: menuItemId,
    },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });
}