import type { CreateCategorytDto, UpdateCategoryDto } from "./category.types.js";

export function validateCreateCategory(data: CreateCategorytDto) {
  const name = data.name?.trim();

  if (!name) {
    throw new Error("Category name is required");
  }

  if (name.length < 2) {
    throw new Error("Category name must contain at least 2 characters");
  }

  return {
    name,
    imageUrl: data.imageUrl?.trim(),
    priority: data.priority,
  };
}

export function validateUpdateCategory(data: UpdateCategoryDto) {
  const result: UpdateCategoryDto = {};

  if (data.name !== undefined) {
    const name = data.name.trim();

    if (!name) {
      throw new Error("Category name cannot be empty");
    }

    if (name.length < 2) {
      throw new Error("Category name must contain at least 2 characters");
    }

    result.name = name;
  }

  return result;
}