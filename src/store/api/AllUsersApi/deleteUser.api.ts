import api from "@/lib/axiosConfiguration";
import type { DeleteUserResponse } from "@/types/AllUsersTypes/deleteUser.types";

export const deleteUser = async (
  userId: number
): Promise<DeleteUserResponse> => {
  const response = await api.delete(`/admin/users/${userId}`);

  return response.data;
};