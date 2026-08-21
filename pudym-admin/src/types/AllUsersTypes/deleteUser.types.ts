export interface DeleteUserResponse {
  success: boolean;
  message: string;
  data: {
    user_id: number;
    is_deleted: boolean;
  };
}