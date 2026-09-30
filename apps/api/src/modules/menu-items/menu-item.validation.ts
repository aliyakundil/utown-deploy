import type {
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from "./menu-item.types.js";

export function validateCreateMenuItem(
  data: CreateMenuItemDto
) {
  const name = data.name?.trim();

  if (!name) {
    throw new Error("Menu item name is required");
  }

  if (name.length < 2) {
    throw new Error(
      "Menu item name must contain at least 2 characters"
    );
  }

  if (data.price === undefined || data.price === null) {
    throw new Error("Price is required");
  }

  if (Number(data.price) <= 0) {
    throw new Error("Price must be greater than 0");
  }

  return {
    name,
    description: data.description?.trim(),
    price: Number(data.price),
    imageUrl: data.imageUrl?.trim(),
  };
}

export function validateUpdateMenuItem(
  data: UpdateMenuItemDto
) {
  const result: UpdateMenuItemDto = {};

  if (data.name !== undefined) {
    const name = data.name.trim();

    if (!name) {
      throw new Error("Menu item name cannot be empty");
    }

    if (name.length < 2) {
      throw new Error(
        "Menu item name must contain at least 2 characters"
      );
    }

    result.name = name;
  }

  if (data.description !== undefined) {
    result.description = data.description.trim();
  }

  if (data.price !== undefined) {
    if (Number(data.price) <= 0) {
      throw new Error("Price must be greater than 0");
    }

    result.price = Number(data.price);
  }

  if (data.imageUrl !== undefined) {
    result.imageUrl = data.imageUrl.trim();
  }

  if (data.isAvailable !== undefined) {
    result.isAvailable = data.isAvailable;
  }

  if (data.categoryId !== undefined) {
    result.categoryId = data.categoryId;
  }

  return result;
}