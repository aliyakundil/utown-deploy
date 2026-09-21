import { Prisma } from "@prisma/client";
import { prisma } from "../../db/prisma.js";
import type { CreateRatingDto } from "./rating.types.js";
import { validateCreateRating } from "./rating.validation.js";

async function updateRestaurantRatingStats(
  tx: Prisma.TransactionClient,
  restaurantId: number
) {
  const stats = await tx.restaurantRating.aggregate({
    where: {
      restaurantId,
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  await tx.restaurant.update({
    where: {
      id: restaurantId,
    },
    data: {
      averageRating: stats._avg.rating ?? 0,
      ratingsCount: stats._count.rating,
    },
  });
}

export async function createRating(
  userId: number,
  restaurantId: number,
  data: CreateRatingDto
) {
  const validatedData = validateCreateRating(data);

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  const completedOrder = await prisma.order.findFirst({
    where: {
      userId,
      restaurantId,
      status: "COMPLETED",
    },
  });

  if (!completedOrder) {
    throw new Error(
      "You can rate only restaurants where you completed an order"
    );
  }

  const existingRating = await prisma.restaurantRating.findUnique({
    where: {
      userId_restaurantId: {
        userId,
        restaurantId,
      },
    },
  });

  if (existingRating) {
    throw new Error("You have already rated this restaurant");
  }

  return prisma.$transaction(async (tx) => {
    const createdRating = await tx.restaurantRating.create({
      data: {
        userId,
        restaurantId,
        rating: validatedData.rating,
        comment: validatedData.comment ?? null,
      },
    });

    await updateRestaurantRatingStats(
      tx,
      restaurantId
    );

    return createdRating;
  })
}

export async function getRatings(
  restaurantId: number
) {
  return prisma.restaurantRating.findMany({
    where: {
      restaurantId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updateRating(
  userId: number,
  restaurantId: number,
  data: CreateRatingDto
) {
  const validatedData =
    validateCreateRating(data);

  const rating =
    await prisma.restaurantRating.findUnique({
      where: {
        userId_restaurantId: {
          userId,
          restaurantId,
        },
      },
    });

  if (!rating) {
    throw new Error("Rating not found");
  }

  return prisma.$transaction(async (tx) => {
    const updatedRating =
      await tx.restaurantRating.update({
        where: {
          id: rating.id,
        },
        data: {
          rating: validatedData.rating,
          comment:
            validatedData.comment ?? null,
        },
      });

    await updateRestaurantRatingStats(
      tx,
      restaurantId
    );

    return updatedRating;
  });
}

export async function deleteRating(
  userId: number,
  restaurantId: number
) {
  const rating =
    await prisma.restaurantRating.findUnique({
      where: {
        userId_restaurantId: {
          userId,
          restaurantId,
        },
      },
    });

  if (!rating) {
    throw new Error("Rating not found");
  }

  return prisma.$transaction(async (tx) => {
    await tx.restaurantRating.delete({
      where: {
        id: rating.id,
      },
    });

    await updateRestaurantRatingStats(
      tx,
      restaurantId
    );

    return {
      success: true,
    };
  });
}

