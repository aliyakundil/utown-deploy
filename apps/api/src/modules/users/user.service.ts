import { prisma } from "../../db/prisma.js";
import type { UpdateUserDto } from "./user.types.js";
import { validateUpdateUser } from "./user.validation.js";

export async function getProfile(
  userId: number
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
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

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: validatedData,
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
    },
  });
}