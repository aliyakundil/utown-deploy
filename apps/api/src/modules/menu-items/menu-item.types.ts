export interface MenuItemOptionDto {
  name: string;
  extraPrice: number;
}

export interface CreateMenuItemDto {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  priority?: number;
  options?: MenuItemOptionDto[];
}

export interface UpdateMenuItemDto {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  isAvailable?: boolean;
  categoryId?: number;
  priority?: number;
  options?: MenuItemOptionDto[];
}