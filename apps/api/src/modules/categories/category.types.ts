export interface CreateCategorytDto {
  name: string;
  imageUrl?: string;
  priority?: number;
}

export interface UpdateCategoryDto {
  name?: string;
  imageUrl?: string;
  priority?: number;
}