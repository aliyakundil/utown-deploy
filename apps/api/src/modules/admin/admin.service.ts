import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../db/prisma.js";
import type { GetUsersOptions, CreateUserByAdminDto, UpdateUserByAdminDto } from "./admin.types.js";

export async function getUsers(options: GetUsersOptions) {
  const page = options.page ? parseInt(options.page) : 1;
  const limit = options.limit ? parseInt(options.limit) : 10;
  const offset = (page - 1) * limit;

  const where = options.search
    ? {
        name: {
          contains: options.search,
        },
      }
    : {};

  const users = await prisma.user.findMany({
    where,
    skip: offset,
    take: limit,
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
    }
  });
  return user;
}

export async function createUserByAdmin(input: CreateUserByAdminDto) {
  if (!input.username?.trim()) {
    throw new Error("Username is required");
  }

  if (!input.password?.trim()) {
    throw new Error("Password is required");
  }

  const hashPassword = await bcrypt.hash(input.password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: input.username,
      email: input.email ?? null,
      password: hashPassword,
      role: input.role ?? "CLIENT",
      phone: input.phone,
    },
  });

  return newUser;
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
    },
  });

  return updatedUser;
}

export async function deleteUserByAdmin(id: number) {
  await prisma.cart.deleteMany({ where: { userId: id } });
  await prisma.order.deleteMany({ where: { userId: id } });
  await prisma.favorite.deleteMany({ where: { userId: id } });
  await prisma.restaurantRating.deleteMany({ where: { userId: id } });

  return prisma.user.delete({
    where: { id },
  });
}