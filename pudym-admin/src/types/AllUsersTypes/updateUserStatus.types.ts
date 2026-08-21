export interface UpdateUserStatusPayload {
  is_deactivated: boolean;
}

export interface UpdateUserStatusResponse {
  success: boolean;
  message: string;
  data: {
    user_id: number;
    is_deactivated: boolean;
    blocked_by_admin: boolean;
  };
}