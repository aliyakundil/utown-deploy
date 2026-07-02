import type { UpdateUserDto } from "./user.types.js";

export function validateUpdateUser(
  data: UpdateUserDto
) {
  return {
    ...(data.name !== undefined && {
      name: data.name.trim(),
    }),

    ...(data.email !== undefined && {
      email: data.email.trim(),
    }),

    ...(data.phone !== undefined && {
      phone: data.phone.trim(),
    }),

    ...(data.city !== undefined && {
      city: data.city.trim(),
    }),

    ...(data.address !== undefined && {
      address: data.address.trim(),
    }),

    ...(data.imageUrl !== undefined && {
      imageUrl: data.imageUrl.trim(),
    }),
  };
}