export interface DayHours {
  isClosed: boolean;
  open?: string;
  close?: string;
  [key: string]: boolean | string | undefined;
}

export type WorkingHours = Record<
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday",
  DayHours
>;

export interface Restaurant {
  id: number;
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  imageUrl: string | null;
  minimumOrder: string | null;
  category: string | null;
  deliveryArea: string | null;
  workingHours: WorkingHours | null;
  averageRating: number;
  ratingsCount: number;
  status: "OPEN" | "CLOSED";
}

export interface Category {
  id: number;
  restaurantId: number;
  name: string;
  imageUrl: string | null;
  priority: number;
}

export interface MenuItemOption {
  id: number;
  menuItemId: number;
  name: string;
  extraPrice: string;
}

export interface MenuItem {
  id: number;
  restaurantId: number;
  categoryId: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  isAvailable: boolean;
  priority: number;
  isDeleted: boolean;
  options: MenuItemOption[];
}

export interface RestaurantDetail extends Restaurant {
  categories: Category[];
  menuItems: MenuItem[];
}

export interface RestaurantListResponse {
  success: boolean;
  data: Restaurant[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface RestaurantDetailResponse {
  success: boolean;
  data: RestaurantDetail;
}

export interface CreateRestaurantRequest {
  ownerId?: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  phone?: string;
  imageUrl?: string;
  minimumOrder?: number;
  category?: string;
  deliveryArea?: string;
  workingHours?: WorkingHours;
}

export type UpdateRestaurantRequest = Partial<CreateRestaurantRequest>;

export interface CategoryListResponse {
  success: boolean;
  data: Category[];
}

export interface CategoryDetailResponse {
  success: boolean;
  data: Category;
}

export interface CreateCategoryRequest {
  name: string;
  imageUrl?: string;
  priority?: number;
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>;

export interface MenuItemListResponse {
  success: boolean;
  data: MenuItem[];
}

export interface MenuItemDetailResponse {
  success: boolean;
  data: MenuItem;
}

export interface MenuItemOptionInput {
  name: string;
  extraPrice: number;
}

export interface CreateMenuItemRequest {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  priority?: number;
  options?: MenuItemOptionInput[];
}

export interface UpdateMenuItemRequest {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  isAvailable?: boolean;
  categoryId?: number;
  priority?: number;
  options?: MenuItemOptionInput[];
}
