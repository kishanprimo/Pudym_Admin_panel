import api from "@/lib/axiosConfiguration";
import type { GetUserStatsResponse } from "@/types/AllUsersTypes/getUserStats.types";

export const getUserStats = async (): Promise<GetUserStatsResponse> => {
  const response = await api.get("/admin/users/stats");

  return response.data;
};