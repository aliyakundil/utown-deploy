import { StatusRestaurants } from "@prisma/client";
import type {
  CreateRestaurantDto,
  UpdateRestaurantDto,
  RestaurantQueryDto,
} from "./restaurant.types.js";

const phoneRegex = /^\+?[0-9]{10,15}$/;

export function validateCreateRestaurant(data: CreateRestaurantDto) {
  const name = data.name?.trim();
  const description = data.description?.trim();
  const address = data.address?.trim();
  const city = data.city?.trim();
  const phone = data.phone?.trim();
  const imageUrl = data.imageUrl?.trim();
  const category = data.category?.trim();
  const deliveryArea = data.deliveryArea?.trim();

  if (!name) {
    throw new Error("Restaurant name is required");
  }

  if (name.length < 2) {
    throw new Error("Restaurant name must contain at least 2 characters");
  }

  if (phone && !phoneRegex.test(phone)) {
    throw new Error("Invalid phone number format");
  }

  if (
    data.status &&
    !Object.values(StatusRestaurants).includes(data.status)
  ) {
    throw new Error("Invalid restaurant status");
  }

  if (
    data.minimumOrder !== undefined &&
    (typeof data.minimumOrder !== "number" || data.minimumOrder < 0)
  ) {
    throw new Error("Minimum order must be a positive number");
  }

  return {
    name,
    description,
    address,
    city,
    phone,
    imageUrl,
    category,
    deliveryArea,
    workingHours: data.workingHours,
    status: data.status ?? StatusRestaurants.OPEN,
    minimumOrder: data.minimumOrder,
  };
}

export function validateUpdateRestaurant(data: UpdateRestaurantDto) {
  const result: UpdateRestaurantDto = {};

  if (data.name !== undefined) {
    const name = data.name.trim();

    if (!name) {
      throw new Error("Restaurant name cannot be empty");
    }

    if (name.length < 2) {
      throw new Error("Restaurant name must contain at least 2 characters");
    }

    result.name = name;
  }

  if (data.description !== undefined) {
    result.description = data.description.trim();
  }

  if (data.address !== undefined) {
    result.address = data.address.trim();
  }

  if (data.phone !== undefined) {
    const phone = data.phone.trim();

    if (phone && !phoneRegex.test(phone)) {
      throw new Error("Invalid phone number format");
    }

    result.phone = phone;
  }

  if (data.imageUrl !== undefined) {
    result.imageUrl = data.imageUrl.trim();
  }

  if (data.city !== undefined) {
    result.city = data.city.trim();
  }

  if (data.category !== undefined) {
    result.category = data.category.trim();
  }

  if (data.deliveryArea !== undefined) {
    result.deliveryArea = data.deliveryArea.trim();
  }

  if (data.workingHours !== undefined) {
    result.workingHours = data.workingHours;
  }

  if (data.status !== undefined) {
    if (!Object.values(StatusRestaurants).includes(data.status)) {
      throw new Error("Invalid restaurant status");
    }

    result.status = data.status;
  }

  if (data.minimumOrder !== undefined) {
    if (typeof data.minimumOrder !== "number" || data.minimumOrder < 0) {
      throw new Error("Minimum order must be a positive number");
    }

    result.minimumOrder = data.minimumOrder;
  }

  return result;
}

export function validateRestaurantQuery(query: RestaurantQueryDto) {
  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 10;
  const search = query.search?.trim();

  if (Number.isNaN(page) || page < 1) {
    throw new Error("Invalid page value");
  }

  if (Number.isNaN(limit) || limit < 1 || limit > 100) {
    throw new Error("Invalid limit value");
  }

  if (
    query.status !== undefined &&
    !Object.values(StatusRestaurants).includes(query.status)
  ) {
    throw new Error("Invalid restaurant status");
  }

  return {
    page,
    limit,
    search,
    status: query.status,
  };
}
