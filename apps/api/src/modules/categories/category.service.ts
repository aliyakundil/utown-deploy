import { prisma } from "../../db/prisma.js";
import { UserRole } from "@prisma/client";

import type { CreateCategorytDto, UpdateCategoryDto } from "./category.types.js";
import { validateCreateCategory, validateUpdateCategory } from "./category.validation.js";

export async function createCategory(
  restaurantId: number,
  currentUserId: number,
  currentUserRole: UserRole,
  data: CreateCategorytDto
) {
  const validatedData = validateCreateCategory(data);

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  const canManage =
    currentUserRole === UserRole.ADMIN ||
    restaurant.ownerId === currentUserId;

  if (!canManage) {
    throw new Error("Forbidden");
  }

  return prisma.category.create({
  data: {
    restaurantId,
    name: validatedData.name,
    ...(validatedData.imageUrl !== undefined && {
      imageUrl: validatedData.imageUrl,
    }),
    ...(validatedData.priority !== undefined && {
      priority: validatedData.priority,
    }),
  },
});
}

export async function getCategories(restaurantId?: number) {
  return prisma.category.findMany({
    ...(restaurantId !== undefined && { where: { restaurantId } }),
    orderBy: { priority: "asc" },
    include: {
      restaurant: true,
    },
  });
}

export async function getCategoryById(id: number) {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      restaurant: true,
      menuItems: true,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
}

export async function updateCategory(
  categoryId: number,
  currentUserId: number,
  currentUserRole: UserRole,
  data: UpdateCategoryDto
) {
  const validatedData = validateUpdateCategory(data);

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

  return prisma.category.update({
    where: {
      id: categoryId,
    },
    data: validatedData,
  });
}

export async function deleteCategory(
  categoryId: number,
  currentUserId: number,
  currentUserRole: UserRole
) {
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

  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });

  return {
    success: true,
  };
}