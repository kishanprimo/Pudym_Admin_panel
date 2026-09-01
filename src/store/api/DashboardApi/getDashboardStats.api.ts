import api from "@/lib/axiosConfiguration";

import type {
  GetDashboardStatsResponse,
} from "@/types/DashboardTypes/dashboard.types";

export const getDashboardStats =
  async (): Promise<GetDashboardStatsResponse> => {
    const response = await api.get(
      "/admin/dashboard/stats"
    );

    return response.data;
  };