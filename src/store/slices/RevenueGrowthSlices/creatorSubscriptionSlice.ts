import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getCreatorSubscriptionReport,
    type CreatorSubscriptionPeriod,
} from "@/store/api/RevenueGrowthApi/getCreatorSubscriptionReport.api";

import type {
    CreatorSubscriptionReportData,
} from "@/types/RevenueGrowthTypes/creatorSubscriptionReport.types";

interface CreatorSubscriptionState {
    data: CreatorSubscriptionReportData | null;
    loading: boolean;
    error: string | null;
}

const initialState: CreatorSubscriptionState = {
    data: null,
    loading: false,
    error: null,
};

export const fetchCreatorSubscriptionReport =
    createAsyncThunk(
        "creatorSubscription/fetchCreatorSubscriptionReport",
        async (
            period: CreatorSubscriptionPeriod = "month",
            { rejectWithValue }
        ) => {
            try {
                const response =
                    await getCreatorSubscriptionReport(
                        period
                    );

                if (!response.success) {
                    return rejectWithValue(
                        response.message
                    );
                }

                return response.data;
            } catch (error: any) {
                return rejectWithValue(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to fetch creator subscription report"
                );
            }
        }
    );

const creatorSubscriptionSlice =
    createSlice({
        name: "creatorSubscription",

        initialState,

        reducers: {
            clearCreatorSubscription: (
                state
            ) => {
                state.data = null;
                state.error = null;
            },
        },

        extraReducers: (builder) => {
            builder
                .addCase(
                    fetchCreatorSubscriptionReport.pending,
                    (state) => {
                        state.loading = true;
                        state.error = null;
                    }
                )

                .addCase(
                    fetchCreatorSubscriptionReport.fulfilled,
                    (state, action) => {
                        state.loading = false;
                        state.data = action.payload;
                    }
                )

                .addCase(
                    fetchCreatorSubscriptionReport.rejected,
                    (state, action) => {
                        state.loading = false;

                        state.error =
                            (action.payload as string) ||
                            "Failed to fetch creator subscription report";
                    }
                );
        },
    });

export const {
    clearCreatorSubscription,
} = creatorSubscriptionSlice.actions;

export default creatorSubscriptionSlice.reducer;