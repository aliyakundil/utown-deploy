export interface AddToCartDto {
  menuItemId: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}