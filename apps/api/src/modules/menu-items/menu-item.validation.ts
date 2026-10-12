import type {
  CreateMenuItemDto,
  UpdateMenuItemDto,
  MenuItemOptionDto,
} from "./menu-item.types.js";

function validateOptions(options: MenuItemOptionDto[]) {
  return options.map((option) => {
    const name = option.name?.trim();

    if (!name) {
      throw new Error("Option name is required");
    }

    if (option.extraPrice === undefined || Number(option.extraPrice) < 0) {
      throw new Error("Option price must be 0 or greater");
    }

    return { name, extraPrice: Number(option.extraPrice) };
  });
}

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
    priority: data.priority !== undefined ? Number(data.priority) : undefined,
    options: data.options ? validateOptions(data.options) : undefined,
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

  if (data.priority !== undefined) {
    result.priority = Number(data.priority);
  }

  if (data.options !== undefined) {
    result.options = validateOptions(data.options);
  }

  return result;
}