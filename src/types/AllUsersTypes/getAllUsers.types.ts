export interface UserListItem {
  user_id: number;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  user_name: string | null;
  email: string | null;
  profile_pic: string | null;
  login_type: string | null;
  role: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  blocked_by_admin: boolean;
  is_deactivated: boolean;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsersPagination {
  total_pages: number;
  total_records: number;
  current_page: number;
  records_per_page: number;
}

export interface GetAllUsersResponse {
  success: boolean;
  message: string;
  data: {
    Records: UserListItem[];
    Pagination: UsersPagination;
  };
}

export interface GetAllUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
}