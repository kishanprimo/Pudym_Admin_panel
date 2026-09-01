import api from "@/lib/axiosConfiguration";

import type {
  LoginPayload,
  LoginResponse,
} from "@/types/auth.types";

export const loginAdmin = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/admin/auth/login",
    payload
  );

  return response.data;
};