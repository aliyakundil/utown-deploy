import { prisma } from "../../db/prisma.js";
import type { UpdateUserDto } from "./user.types.js";
import { validateUpdateUser } from "./user.validation.js";

export async function getProfile(
  userId: number
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      city: true,
      address: true,
      imageUrl: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function updateProfile(
  userId: number,
  data: UpdateUserDto
) {
  const validatedData =
    validateUpdateUser(data);

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: validatedData,
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      city: true,
      address: true,
      role: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteUser(
  userId: number
) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      deletedAt: new Date(),
      refreshToken: null,
    },
  });
}