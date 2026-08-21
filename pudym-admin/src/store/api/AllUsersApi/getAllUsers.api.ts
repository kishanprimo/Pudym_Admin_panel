import api from "@/lib/axiosConfiguration";

import type {
  GetAllUsersParams,
  GetAllUsersResponse,
} from "@/types/AllUsersTypes/getAllUsers.types";

export const getAllUsers = async (
  params: GetAllUsersParams
): Promise<GetAllUsersResponse> => {
  const response = await api.get("/admin/users", {
    params,
  });

  return response.data;
};