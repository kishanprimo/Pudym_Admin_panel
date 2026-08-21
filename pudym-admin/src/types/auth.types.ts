export interface LoginPayload {
  email: string;
  password: string;
}

export interface AdminData {
  admin_id: number;
  name: string;
  email: string;
  token: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: AdminData;
}