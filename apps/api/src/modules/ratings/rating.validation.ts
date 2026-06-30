import type { CreateRatingDto } from "./rating.types.js";

export function validateCreateRating(data: CreateRatingDto) {
  const rating = Number(data.rating);
  const comment = data.comment?.trim();

  if (Number.isNaN(rating)) {
    throw new Error("Rating must be a number");
  }

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  return { rating, comment };
}