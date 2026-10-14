import { StatusRestaurants } from "@prisma/client";
import type {
  CreateRestaurantDto,
  UpdateRestaurantDto,
  RestaurantQueryDto,
} from "./restaurant.types.js";

const phoneRegex = /^\+?[0-9]{10,15}$/;

const WORKING_HOURS_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

function isValidWorkingHours(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;

  return WORKING_HOURS_DAYS.every((day) => {
    const dayValue = (value as Record<string, unknown>)[day];

    if (typeof dayValue !== "object" || dayValue === null) return false;

    const { isClosed, open, close } = dayValue as Record<string, unknown>;

    if (typeof isClosed !== "boolean") return false;
    if (open !== undefined && typeof open !== "string") return false;
    if (close !== undefined && typeof close !== "string") return false;

    return true;
  });
}

type FieldKind = "text" | "phone" | "status" | "minimumOrder" | "workingHours";

// Single source of truth for every Restaurant field except `ownerId` (create-only)
// and `name` (required on create, has its own min-length rule) — both are validated
// separately below. Add a new field here once and both validators pick it up.
type SimpleFieldKey = Exclude<keyof CreateRestaurantDto, "ownerId" | "name">;

const RESTAURANT_FIELDS: { key: SimpleFieldKey; kind: FieldKind }[] = [
  { key: "description", kind: "text" },
  { key: "address", kind: "text" },
  { key: "city", kind: "text" },
  { key: "phone", kind: "phone" },
  { key: "imageUrl", kind: "text" },
  { key: "category", kind: "text" },
  { key: "deliveryArea", kind: "text" },
  { key: "status", kind: "status" },
  { key: "minimumOrder", kind: "minimumOrder" },
  { key: "workingHours", kind: "workingHours" },
];

function validateField(kind: FieldKind, rawValue: unknown): unknown {
  switch (kind) {
    case "text":
      return typeof rawValue === "string" ? rawValue.trim() : rawValue;

    case "phone": {
      const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;

      if (value && !phoneRegex.test(value as string)) {
        throw new Error("Invalid phone number format");
      }

      return value;
    }

    case "status":
      if (
        rawValue !== undefined &&
        !Object.values(StatusRestaurants).includes(
          rawValue as StatusRestaurants
        )
      ) {
        throw new Error("Invalid restaurant status");
      }

      return rawValue;

    case "minimumOrder":
      if (
        rawValue !== undefined &&
        (typeof rawValue !== "number" || rawValue < 0)
      ) {
        throw new Error("Minimum order must be a positive number");
      }

      return rawValue;

    case "workingHours":
      if (rawValue !== undefined && !isValidWorkingHours(rawValue)) {
        throw new Error("Invalid working hours format");
      }

      return rawValue;
  }
}

export function validateCreateRestaurant(data: CreateRestaurantDto) {
  if (
    data.ownerId !== undefined &&
    (typeof data.ownerId !== "number" || data.ownerId <= 0)
  ) {
    throw new Error("Invalid owner id");
  }

  const name = data.name?.trim();

  if (!name) {
    throw new Error("Restaurant name is required");
  }

  if (name.length < 2) {
    throw new Error("Restaurant name must contain at least 2 characters");
  }

  const fields: Pick<CreateRestaurantDto, SimpleFieldKey> = {};

  for (const { key, kind } of RESTAURANT_FIELDS) {
    // Each field's own validator knows its shape; a single shared loop body
    // can't express that per-key, so this cast is the deliberate escape hatch.
    (fields as unknown as Record<string, unknown>)[key] = validateField(kind, data[key]);
  }

  return {
    ownerId: data.ownerId,
    name,
    ...fields,
    status: (fields.status as StatusRestaurants | undefined) ?? StatusRestaurants.OPEN,
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

  for (const { key, kind } of RESTAURANT_FIELDS) {
    if (data[key] === undefined) continue;

    (result as unknown as Record<string, unknown>)[key] = validateField(kind, data[key]);
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
