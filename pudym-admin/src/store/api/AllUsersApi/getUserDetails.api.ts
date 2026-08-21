import api from "@/lib/axiosConfiguration";
import type { GetUserDetailsResponse } from "@/types/AllUsersTypes/getUserDetails.types";

export const getUserDetails = async (
  userId: number
): Promise<GetUserDetailsResponse> => {
  const response = await api.get(`/admin/users/${userId}`);

  return response.data;
};