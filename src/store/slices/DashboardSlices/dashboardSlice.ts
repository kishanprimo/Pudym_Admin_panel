import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import { getDashboardStats } from "@/store/api/DashboardApi/getDashboardStats.api";

import type {
  DashboardStats,
} from "@/types/DashboardTypes/dashboard.types";

interface DashboardState {
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: {
    total_users: 0,
    active_users: 0,
    deactivated_users: 0,
    blocked_users: 0,
    total_creators: 0,
    total_revenue: 0,
    total_withdrawal_coins: 0,

    top_users: [],
    top_creators: [],
  },

  loading: false,
  error: null,
};
/**
 * Get Dashboard Statistics
 */
export const fetchDashboardStats =
  createAsyncThunk<
    Awaited<ReturnType<typeof getDashboardStats>>,
    void,
    { rejectValue: string }
  >(
    "dashboard/fetchDashboardStats",
    async (_, { rejectWithValue }) => {
      try {
        return await getDashboardStats();
      } catch (error) {
        return rejectWithValue(
          error instanceof Error
            ? error.message
            : "Failed to fetch dashboard statistics"
        );
      }
    }
  );

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState,

  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /*
       * ==========================================
       * GET DASHBOARD STATS
       * ==========================================
       */

      .addCase(
        fetchDashboardStats.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchDashboardStats.fulfilled,
        (state, action) => {
          state.loading = false;

          if (action.payload.success) {
            state.stats = action.payload.data;
          }
        }
      )

      .addCase(
        fetchDashboardStats.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch dashboard statistics";
        }
      );
  },
});

export const {
  clearDashboardError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;