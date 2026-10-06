import { prisma } from "../../db/prisma.js";
import { UserRole } from "@prisma/client";
import type {
  CreateRestaurantDto,
  UpdateRestaurantDto,
  RestaurantQueryDto,
} from "./restaurant.types.js";
import {
  validateCreateRestaurant,
  validateUpdateRestaurant,
  validateRestaurantQuery,
} from "./restaurant.validation.js";

export async function createRestaurant(
  ownerId: number,
  data: CreateRestaurantDto
) {
  const validatedData = validateCreateRestaurant(data);

  const owner = await prisma.user.findUnique({
    where: { id: ownerId },
  });

  if (!owner) {
    throw new Error("Owner not found");
  }
  
  return prisma.restaurant.create({
    data: {
      ownerId,
      name: validatedData.name,
      status: validatedData.status,
      ...(validatedData.description !== undefined && {
        description: validatedData.description,
      }),
      ...(validatedData.address !== undefined && {
        address: validatedData.address,
      }),
      ...(validatedData.city !== undefined && {
        city: validatedData.city,
      }),
      ...(validatedData.phone !== undefined && {
        phone: validatedData.phone,
      }),
      ...(validatedData.imageUrl !== undefined && {
        imageUrl: validatedData.imageUrl,
      }),
      ...(validatedData.minimumOrder !== undefined && {
        minimumOrder: validatedData.minimumOrder,
      }),
      ...(validatedData.category !== undefined && {
        category: validatedData.category,
      }),
      ...(validatedData.deliveryArea !== undefined && {
        deliveryArea: validatedData.deliveryArea,
      }),
      ...(validatedData.workingHours !== undefined && {
        workingHours: validatedData.workingHours,
      }),
    },
  });
}

export async function getRestaurants(
  query: RestaurantQueryDto,
  ownerId?: number
) {
  const { page, limit, search, status } = validateRestaurantQuery(query);

  const where = {
    ...(ownerId !== undefined && { ownerId }),
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
            { address: { contains: search } },
            { city: { contains: search } },
            { phone: { contains: search } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
  };

  const [restaurants, total] = await Promise.all([
    prisma.restaurant.findMany({
      where,
      ...(ownerId === undefined && {
        skip: (page - 1) * limit,
        take: limit,
      }),
      orderBy: {
        createdAt: "desc",
      },
      include:
        ownerId !== undefined
          ? { categories: true, menuItems: true }
          : {
              owner: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                },
              },
            },
    }),
    prisma.restaurant.count({ where }),
  ]);

  if (ownerId !== undefined) {
    return restaurants;
  }

  return {
    data: restaurants,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getRestaurantById(id: number) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          phone: true,
          role: true,
        },
      },
      categories: true,
      menuItems: true,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  return restaurant;
}

export async function updateRestaurant(
  restaurantId: number,
  currentUserId: number,
  currentUserRole: UserRole,
  data: UpdateRestaurantDto
) {
  const validatedData = validateUpdateRestaurant(data);

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  const canManage =
    currentUserRole === UserRole.ADMIN || restaurant.ownerId === currentUserId;

  if (!canManage) {
    throw new Error("Forbidden");
  }

  return prisma.restaurant.update({
    where: { id: restaurantId },
    data: validatedData,
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          phone: true,
          role: true,
        },
      },
    },
  });
}

export async function deleteRestaurant(
  restaurantId: number,
  currentUserId: number,
  currentUserRole: UserRole
) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  const canManage =
    currentUserRole === UserRole.ADMIN || restaurant.ownerId === currentUserId;

  if (!canManage) {
    throw new Error("Forbidden");
  }

  await prisma.restaurant.delete({
    where: { id: restaurantId },
  });

  return {
    success: true,
  };
}
