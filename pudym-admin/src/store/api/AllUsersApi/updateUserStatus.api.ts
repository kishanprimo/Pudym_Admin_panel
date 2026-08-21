import api from "@/lib/axiosConfiguration";
import type { UpdateUserStatusResponse } from "@/types/AllUsersTypes/updateUserStatus.types";

export const updateUserStatus = async (
  userId: number,
  is_deactivated: boolean
): Promise<UpdateUserStatusResponse> => {
  const response = await api.patch(
    `/admin/users/${userId}/status`,
    {
      is_deactivated,
    }
  );

  return response.data;
};