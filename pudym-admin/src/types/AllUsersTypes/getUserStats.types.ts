export interface UserStats {
  total_users: number;
  active_users: number;
  deactivated_users: number;
  blocked_users: number;
}

export interface GetUserStatsResponse {
  success: boolean;
  message: string;
  data: UserStats;
}