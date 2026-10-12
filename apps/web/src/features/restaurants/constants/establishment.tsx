import type { WorkingHours } from "../types/restaurant.types";

export const CATEGORY_OPTIONS = [
  "Korean BBQ",
  "Fried Chicken",
  "Bunsik",
  "Cafe & Desserts",
  "Noodles",
  "Bakery",
  "Fast food",
  "Other",
];

export const DAYS: { key: keyof WorkingHours; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export function buildDefaultWorkingHours(): WorkingHours {
  const result = {} as WorkingHours;

  for (const { key } of DAYS) {
    result[key] = { isClosed: false, open: "09:00", close: "22:00" };
  }

  return result;
}