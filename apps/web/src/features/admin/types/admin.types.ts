export type UserRole = "CLIENT" | "RESTAURATEUR" | "ADMIN";

export interface AdminUser {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  address: string | null;
  role: UserRole;
  imageUrl: string | null;
  isVerified: boolean;
  isBanned: boolean;
  createdAt: string;
}

export interface AdminMeta {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

export interface AdminUsersResponse {
  success: boolean;
  data: {
    users: AdminUser[];
    meta: AdminMeta;
  };
}

export interface AdminOrderItem {
  id: number;
  menuItemId: number;
  quantity: number;
  price: string;
  itemName: string;
}

export interface AdminOrder {
  id: number;
  status: string;
  totalPrice: string;
  createdAt: string;
  restaurant: { id: number; name: string };
  user: { id: number; name: string; phone: string };
  items: AdminOrderItem[];
}

export interface AdminOrdersResponse {
  success: boolean;
  data: {
    orders: AdminOrder[];
    meta: AdminMeta;
  };
}

export interface CreateClientRequest {
  username: string;
  phone: string;
  address?: string;
}

export interface AdminUserResponse {
  success: boolean;
  data: AdminUser;
}

export interface CreateUserByAdminResponse {
  success: boolean;
  data: {
    user: AdminUser;
    generatedPassword?: string;
  };
}
