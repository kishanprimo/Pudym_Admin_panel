import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getUserGrowthReport,
    type GrowthReportPeriod,
} from "@/store/api/RevenueGrowthApi/getUserGrowthReport.api";

import type {
    UserGrowthReportData,
} from "@/types/RevenueGrowthTypes/userGrowthReport.types";

interface UserGrowthState {
    data: UserGrowthReportData | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserGrowthState = {
    data: null,
    loading: false,
    error: null,
};

export const fetchUserGrowthReport = createAsyncThunk(
    "userGrowth/fetchUserGrowthReport",
    async (
        period: GrowthReportPeriod = "month",
        { rejectWithValue }
    ) => {
        try {
            const response = await getUserGrowthReport(period);

            if (!response.success) {
                return rejectWithValue(response.message);
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to fetch user growth report"
            );
        }
    }
);

const userGrowthSlice = createSlice({
    name: "userGrowth",

    initialState,

    reducers: {
        clearUserGrowth: (state) => {
            state.data = null;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchUserGrowthReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchUserGrowthReport.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })

            .addCase(fetchUserGrowthReport.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) ||
                    "Failed to fetch user growth report";
            });
    },
});

export const {
    clearUserGrowth,
} = userGrowthSlice.actions;

export default userGrowthSlice.reducer;