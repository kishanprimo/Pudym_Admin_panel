import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

import { loginAdmin as loginAdminApi } from "@/store/api/authApi";
import type {
  AdminData,
  LoginPayload,
} from "@/types/auth.types";

interface AuthState {
  admin: AdminData | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  admin: null,
  token: null,
  loading: false,
  error: null,
};

export const loginAdmin = createAsyncThunk<
  AdminData,
  LoginPayload,
  { rejectValue: string }
>(
  "auth/loginAdmin",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await loginAdminApi(payload);

      if (!response.success) {
        return rejectWithValue(
          response.message || "Login failed"
        );
      }

      const { data } = response;

      Cookies.set(
        "pudym_admin_auth_token",
        data.token,
        {
          expires: 1,
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Login failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      state.admin = null;
      state.token = null;
      state.error = null;

      Cookies.remove("pudym_admin_auth_token");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        state.token = action.payload.token;
        state.error = null;
      })

      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;