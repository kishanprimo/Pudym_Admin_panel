import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getCreatorGrowthReport,
    type CreatorGrowthPeriod,
} from "@/store/api/RevenueGrowthApi/getCreatorGrowthReport.api";

import type {
    CreatorGrowthReportData,
} from "@/types/RevenueGrowthTypes/creatorGrowthReport.types";

interface CreatorGrowthState {
    data: CreatorGrowthReportData | null;
    loading: boolean;
    error: string | null;
}

const initialState: CreatorGrowthState = {
    data: null,
    loading: false,
    error: null,
};

export const fetchCreatorGrowthReport = createAsyncThunk(
    "creatorGrowth/fetchCreatorGrowthReport",
    async (
        period: CreatorGrowthPeriod = "month",
        { rejectWithValue }
    ) => {
        try {
            const response = await getCreatorGrowthReport(period);

            if (!response.success) {
                return rejectWithValue(response.message);
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to fetch creator growth report"
            );
        }
    }
);

const creatorGrowthSlice = createSlice({
    name: "creatorGrowth",

    initialState,

    reducers: {
        clearCreatorGrowth: (state) => {
            state.data = null;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchCreatorGrowthReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchCreatorGrowthReport.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })

            .addCase(fetchCreatorGrowthReport.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) ||
                    "Failed to fetch creator growth report";
            });
    },
});

export const {
    clearCreatorGrowth,
} = creatorGrowthSlice.actions;

export default creatorGrowthSlice.reducer;