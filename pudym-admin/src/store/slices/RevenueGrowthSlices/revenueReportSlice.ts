import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getRevenueReport,
    type ReportPeriod,
} from "@/store/api/RevenueGrowthApi/getRevenueReport.api";

import type {
    RevenueReportData,
} from "@/types/RevenueGrowthTypes/revenueReport.types";

interface RevenueReportState {
    data: RevenueReportData | null;
    loading: boolean;
    error: string | null;
}

const initialState: RevenueReportState = {
    data: null,
    loading: false,
    error: null,
};

export const fetchRevenueReport = createAsyncThunk(
    "revenueReport/fetchRevenueReport",
    async (period: ReportPeriod = "month", { rejectWithValue }) => {
        try {
            const response = await getRevenueReport(period);

            if (!response.success) {
                return rejectWithValue(response.message);
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to fetch revenue report"
            );
        }
    }
);

const revenueReportSlice = createSlice({
    name: "revenueReport",

    initialState,

    reducers: {
        clearRevenueReport: (state) => {
            state.data = null;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchRevenueReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchRevenueReport.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })

            .addCase(fetchRevenueReport.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) ||
                    "Failed to fetch revenue report";
            });
    },
});

export const {
    clearRevenueReport,
} = revenueReportSlice.actions;

export default revenueReportSlice.reducer;