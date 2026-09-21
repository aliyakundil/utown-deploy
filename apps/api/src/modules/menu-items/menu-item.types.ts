export interface CreateMenuItemDto {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

export interface UpdateMenuItemDto {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  isAvailable?: boolean;
  categoryId?: number;
}
