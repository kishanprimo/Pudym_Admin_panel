export interface DashboardTopUser {
  user_id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  profile_pic: string;
  available_coins: number;
  is_deactivated: boolean;
  blocked_by_admin: boolean;
  createdAt: string;
  role: "user";
}

export interface DashboardTopCreator {
  user_id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  profile_pic: string;
  total_socials: number;
  available_coins: number;
  is_deactivated: boolean;
  blocked_by_admin: boolean;
  createdAt: string;
  role: "creator";
}

export interface DashboardStats {
  total_users: number;
  active_users: number;
  deactivated_users: number;
  blocked_users: number;
  total_creators: number;
  total_revenue: number;
  total_withdrawal_coins: number;

  top_users: DashboardTopUser[];
  top_creators: DashboardTopCreator[];
}

export interface GetDashboardStatsResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}