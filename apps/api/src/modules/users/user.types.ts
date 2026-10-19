export interface UpdateUserDto {
  name?: string;
  email?: string | null;
  phone?: string;
  city?: string;
  address?: string;
  imageUrl?: string;
}