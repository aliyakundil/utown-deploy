import api from "../../../lib/api";
import type {
  UserProfileResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "../types/profile.types";

export async function getMyProfile() {
  const response = await api.get<UserProfileResponse>("/users/me");

  return response.data;
}

export async function updateProfile(data: UpdateProfileRequest) {
  const response = await api.patch<UserProfileResponse>("/users/me", data);

  return response.data;
}

export async function deleteProfile() {
  const response = await api.delete("/users/me");

  return response.data;
}

export async function changePassword(data: ChangePasswordRequest) {
  const response = await api.patch<ChangePasswordResponse>(
    "/auth/change-password",
    data
  );

  return response.data;
}
