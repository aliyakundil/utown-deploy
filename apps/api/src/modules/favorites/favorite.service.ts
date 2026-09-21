import { prisma } from "../../db/prisma.js";

import type { CreateFavoriteDto } from "./favorite.types.js";
import { validateCreateFavorite } from "./favorite.validation.js";

export async function addFavorite(
  userId: number,
  data: CreateFavoriteDto
) {
  const validatedData =
    validateCreateFavorite(data);

  const restaurant =
    await prisma.restaurant.findUnique({
      where: {
        id: validatedData.restaurantId,
      },
    });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  const existingFavorite =
    await prisma.favorite.findUnique({
      where: {
        userId_restaurantId: {
          userId,
          restaurantId:
            validatedData.restaurantId,
        },
      },
    });

  if (existingFavorite) {
    throw new Error(
      "Restaurant already in favorites"
    );
  }

  return prisma.favorite.create({
    data: {
      userId,
      restaurantId:
        validatedData.restaurantId,
    },
  });
}


export async function getFavorites(
  userId: number
) {
  return prisma.favorite.findMany({
    where: {
      userId,
    },
    include: {
      restaurant: true,
    },
  });
}


export async function removeFavorite(
  userId: number,
  restaurantId: number
) {
  const favorite =
    await prisma.favorite.findUnique({
      where: {
        userId_restaurantId: {
          userId,
          restaurantId,
        },
      },
    });

  if (!favorite) {
    throw new Error("Favorite not found");
  }

  await prisma.favorite.delete({
    where: {
      id: favorite.id,
    },
  });

  return {
    success: true,
  };
}