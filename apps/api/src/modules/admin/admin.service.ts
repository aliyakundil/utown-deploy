import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { prisma } from "../../db/prisma.js";
import { getIO } from "../../sockets/index.js";
import type { GetUsersOptions, CreateUserByAdminDto, UpdateUserByAdminDto } from "./admin.types.js";

export async function getUsers(options: GetUsersOptions) {
  const page = options.page ? parseInt(options.page) : 1;
  const limit = options.limit ? parseInt(options.limit) : 10;
  const offset = (page - 1) * limit;

  const where: any = options.search
    ? {
        OR: [
          { name: { contains: options.search } },
          { phone: { contains: options.search } },
        ],
      }
    : {};

  if (options.role) {
    where.role = options.role;
  }

  const users = await prisma.user.findMany({
    where,
    skip: offset,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      city: true,
      address: true,
      role: true,
      imageUrl: true,
      isVerified: true,
      createdAt: true,
    },
  });

  const total = await prisma.user.count({
    where,
  });

  return {
    users,
    meta: {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    },
  };
}

export async function getUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: id
    },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      city: true,
      address: true,
      role: true,
      imageUrl: true,
      isVerified: true,
      createdAt: true,
    },
  });
  return user;
}

export async function createUserByAdmin(input: CreateUserByAdminDto) {
  if (!input.username?.trim()) {
    throw new Error("Username is required");
  }

  if (!input.phone?.trim()) {
    throw new Error("Phone is required");
  }

  const wasGenerated = !input.password?.trim();

  const password =
    input.password?.trim() || crypto.randomBytes(6).toString("hex");
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: input.username,
      email: input.email ?? null,
      address: input.address ?? null,
      password: hashPassword,
      role: input.role ?? "CLIENT",
      phone: input.phone,
    },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      city: true,
      address: true,
      role: true,
      imageUrl: true,
      isVerified: true,
      createdAt: true,
    },
  });

  return {
    user: newUser,
    generatedPassword: wasGenerated ? password : undefined,
  };
}

export async function updateUserByAdmin(id: number, input: any) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) return null;

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      name: input.username?.trim(),
      email: input.email ?? null,
      city: input.city ?? undefined,
      address: input.address ?? undefined,
      imageUrl: input.imageUrl ?? undefined,
    },
  });

  return updatedUser;
}

export async function patchUserByAdmin(id: number, input: UpdateUserByAdminDto) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) return null;

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      name: input.username?.trimEnd() ?? user.name,
      email: input.email ?? user.email,
      phone: input.phone ?? user.phone,
      city: input.city ?? user.city,
      address: input.address ?? user.address,
      imageUrl: input.imageUrl ?? user.imageUrl,
      role: input.role ?? user.role,
    },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      city: true,
      address: true,
      role: true,
      imageUrl: true,
      isVerified: true,
      createdAt: true,
    },
  });

  return updatedUser;
}

export async function getAllOrders(options: GetUsersOptions) {
  const page = options.page ? parseInt(options.page) : 1;
  const limit = options.limit ? parseInt(options.limit) : 20;
  const offset = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        restaurant: {
          select: { id: true, name: true },
        },
        user: {
          select: { id: true, name: true, phone: true },
        },
        items: true,
      },
    }),
    prisma.order.count(),
  ]);

  return {
    orders,
    meta: {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    },
  };
}

export async function deleteUserByAdmin(id: number) {
  const restaurantCount = await prisma.restaurant.count({
    where: { ownerId: id },
  });

  if (restaurantCount > 0) {
    throw new Error(
      "This user owns one or more restaurants. Reassign or delete their restaurants before deleting the user."
    );
  }

  const [cart, orders] = await Promise.all([
    prisma.cart.findUnique({ where: { userId: id }, select: { id: true } }),
    prisma.order.findMany({ where: { userId: id }, select: { id: true } }),
  ]);

  const orderIds = orders.map((o) => o.id);

  return await prisma.$transaction([
    ...(cart ? [prisma.cartItem.deleteMany({ where: { cartId: cart.id } })] : []),
    prisma.orderItem.deleteMany({ where: { orderId: { in: orderIds } } }),
    prisma.notification.deleteMany({ where: { userId: id } }),
    prisma.cart.deleteMany({ where: { userId: id } }),
    prisma.order.deleteMany({ where: { userId: id } }),
    prisma.favorite.deleteMany({ where: { userId: id } }),
    prisma.restaurantRating.deleteMany({ where: { userId: id } }),
    prisma.upload.deleteMany({ where: { userId: id } }),
    prisma.user.delete({ where: { id } }),
  ]);
}

export async function sendSystemNotification(
  title: string,
  message: string,
  userId?: number
) {
  if (!title.trim()) {
    throw new Error("Title is required");
  }

  if (!message.trim()) {
    throw new Error("Message is required");
  }

  if (userId !== undefined) {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type: "SYSTEM",
        title: title.trim(),
        message: message.trim(),
      },
    });

    getIO().to(`user:${userId}`).emit("notification:system", {
      title: notification.title,
      message: notification.message,
    });

    return { success: true, count: 1 };
  }

  const users = await prisma.user.findMany({ select: { id: true } });

  await prisma.notification.createMany({
    data: users.map((user) => ({
      userId: user.id,
      type: "SYSTEM" as const,
      title: title.trim(),
      message: message.trim(),
    })),
  });

  getIO().emit("notification:system", {
    title: title.trim(),
    message: message.trim(),
  });

  return { success: true, count: users.length };
}