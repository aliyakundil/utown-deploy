import { prisma } from "../../db/prisma.js";

import type { AddToCartDto, UpdateCartItemDto } from "./cart.types.js";
import { validateAddToCart, validateUpdateCartItem } from "./cart.validation.js";

export async function addToCart(
  userId: number,
  data: AddToCartDto
) {
  const validatedData = validateAddToCart(data);

  const menuItem = await prisma.menuItem.findUnique({
    where: {
      id: validatedData.menuItemId,
    },
  });

  if (!menuItem) {
    throw new Error("Menu item not found");
  }

  let cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  if (cart && !cart.restaurantId) {
    cart = await prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        restaurantId: menuItem.restaurantId,
      },
    });
  }

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
        restaurantId: menuItem.restaurantId,
      },
    });
  }

  if (
    cart.restaurantId &&
    cart.restaurantId !== menuItem.restaurantId
  ) {
    throw new Error(
      "You can order only from one restaurant at a time"
    );
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_menuItemId: {
        cartId: cart.id,
        menuItemId: menuItem.id,
      },
    },
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity:
          existingItem.quantity +
          validatedData.quantity,
      },
    });
  }

  if (!menuItem.price) {
    throw new Error("Menu item price is not set");
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      menuItemId: menuItem.id,
      quantity: validatedData.quantity,
      priceSnapshot: menuItem.price,
    },
  });
}

export async function getCart(userId: number) {
  return prisma.cart.upsert({
    where: {
      userId,
    },
    create: {
      userId,
    },
    update: {},
    include: {
      items: {
        include: {
          menuItem: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              imageUrl: true,
              isAvailable: true,
            },
          },
        },
      },
    },
  });
}

export async function updateCartItem(
  cartItemId: number,
  userId: number,
  data: UpdateCartItemDto
) {
  const validatedData =
    validateUpdateCartItem(data);

  const cartItem = await prisma.cartItem.findUnique({
    where: {
      id: cartItemId,
    },
    include: {
      cart: true,
    },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  if (cartItem.cart.userId !== userId) {
    throw new Error("Forbidden");
  }

  return prisma.cartItem.update({
    where: {
      id: cartItemId,
    },
    data: {
      quantity: validatedData.quantity,
    },
  });
}

export async function removeCartItem(
  cartItemId: number,
  userId: number
) {
  const cartItem = await prisma.cartItem.findUnique({
    where: {
      id: cartItemId,
    },
    include: {
      cart: true,
    },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  if (cartItem.cart.userId !== userId) {
    throw new Error("Forbidden");
  }

  await prisma.cartItem.delete({
    where: {
      id: cartItemId,
    },
  });

  return {
    success: true,
  };
}

export async function clearCart(userId: number) {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });

  await prisma.cart.update({
    where: {
      id: cart.id,
    },
    data: {
      restaurantId: null,
    },
  });

  return {
    success: true,
  };
}