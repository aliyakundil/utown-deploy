import type { CreateUserByAdminDto, UpdateUserByAdminDto } from "./admin.types.js";

const phoneRegex = /^\+?[0-9]{10,15}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{9,}$/;

export function validateCreateUser(data: CreateUserByAdminDto) {
  const username = data.username?.trim();
  const phone = data.phone?.trim();
  const password = data.password?.trim();

  if (!username) throw new Error("Username is required");
  if (username.length < 2) throw new Error("Username must be at least 2 chars");

  if (!phone) throw new Error("Phone is required");
  if (!phoneRegex.test(phone)) throw new Error("Invalid phone format");

  if (!password) throw new Error("Password is required");
  if (!passwordRegex.test(password)) {
    throw new Error("Password must be 9+ chars, 1 uppercase, 1 number");
  }

  return {
    username,
    phone,
    password,
    email: data.email ?? null,
    role: data.role,
  };
}

export function validateUpdateUser(data: UpdateUserByAdminDto) {
  const username = data.username?.trim();
  const phone = data.phone?.trim();

  if (
    !username &&
    !phone &&
    !data.email &&
    !data.city &&
    !data.address &&
    !data.imageUrl &&
    !data.role
  ) {
    throw new Error("At least one field required");
  }

  return {
    username,
    phone,
    email: data.email,
    city: data.city,
    address: data.address,
    imageUrl: data.imageUrl,
    role: data.role,
  };
}

export function validateId(id: string) {
  const parsed = Number(id);
  if (!parsed || Number.isNaN(parsed)) {
    throw new Error("Invalid user id");
  }
  return parsed;
}