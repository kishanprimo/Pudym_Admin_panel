import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/lib/axiosConfiguration";

import type {
    CreatorPlan,
    CreatorPlansPagination,
    CreatorPlansResponse,
} from "@/types/CreatorPlansTypes/creatorPlansTypes";

interface FetchCreatorPlansParams {
    page: number;
    pageSize: number;
}

interface CreatorPlansState {
    plans: CreatorPlan[];
    pagination: CreatorPlansPagination;
    loading: boolean;
    error: string | null;
}

const initialState: CreatorPlansState = {
    plans: [],

    pagination: {
        total_pages: 0,
        total_records: 0,
        current_page: 1,
        records_per_page: 5,
    },

    loading: false,
    error: null,
};

/*
 * ==========================================
 * FETCH CREATOR PLANS
 * ==========================================
 */

export const fetchCreatorPlans = createAsyncThunk<
    CreatorPlansResponse,
    FetchCreatorPlansParams,
    {
        rejectValue: string;
    }
>(
    "creatorPlans/fetchCreatorPlans",

    async ({ page, pageSize }, { rejectWithValue }) => {
        try {
            const response = await axios.get<CreatorPlansResponse>(
                "/admin/plans",
                {
                    params: {
                        page,
                        pageSize,
                    },
                }
            );

            console.log(
                "CREATOR PLANS API RESPONSE:",
                response.data
            );

            return response.data;
        } catch (error: any) {
            console.error(
                "CREATOR PLANS API ERROR:",
                error?.response?.data || error
            );

            return rejectWithValue(
                error?.response?.data?.message ||
                    "Failed to fetch creator plans"
            );
        }
    }
);

/*
 * ==========================================
 * SLICE
 * ==========================================
 */

const creatorPlansSlice = createSlice({
    name: "creatorPlans",

    initialState,

    reducers: {
        clearCreatorPlansError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            /*
             * FETCH PENDING
             */

            .addCase(
                fetchCreatorPlans.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            /*
             * FETCH SUCCESS
             */

            .addCase(
                fetchCreatorPlans.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.error = null;

                    state.plans =
                        action.payload.data?.Records || [];

                    state.pagination =
                        action.payload.data?.Pagination || {
                            total_pages: 0,
                            total_records: 0,
                            current_page: 1,
                            records_per_page: 5,
                        };
                }
            )

            /*
             * FETCH FAILED
             */

            .addCase(
                fetchCreatorPlans.rejected,
                (state, action) => {
                    state.loading = false;
                    state.plans = [];

                    state.error =
                        action.payload ||
                        "Failed to fetch creator plans";
                }
            );
    },
});

export const {
    clearCreatorPlansError,
} = creatorPlansSlice.actions;

export default creatorPlansSlice.reducer;