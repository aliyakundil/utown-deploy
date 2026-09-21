export interface UserProfile {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  address: string | null;
  imageUrl: string | null;
  role: string;
}

export interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  address?: string;
}

export interface ChangePasswordRequest {
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}
