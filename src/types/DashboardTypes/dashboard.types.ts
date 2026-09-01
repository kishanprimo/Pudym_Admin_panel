export interface DashboardStats {
  total_users: number;
  active_users: number;
  deactivated_users: number;
  blocked_users: number;
  total_creators: number;
  total_revenue: number;
}

export interface GetDashboardStatsResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}