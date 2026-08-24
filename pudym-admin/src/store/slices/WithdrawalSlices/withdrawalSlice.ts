import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getWithdrawals } from "@/store/api/WithdrawalApi/getWithdrawals.api";
import { getWithdrawalDetails } from "@/store/api/WithdrawalApi/getWithdrawalDetails.api";
import { approveWithdrawal, rejectWithdrawal } from "@/store/api/WithdrawalApi/withdrawalActions.api";
import type { Withdrawal } from "@/types/WithdrawalTypes/withdrawal.types";

interface WithdrawalState {
    withdrawals: Withdrawal[];
    loading: boolean;
    error: string | null;

    selectedWithdrawal: Withdrawal | null;
    detailsLoading: boolean;
    detailsError: string | null;

    actionLoading: "approve" | "reject" | null;
    actionError: string | null;
}

const initialState: WithdrawalState = {
    withdrawals: [],
    loading: false,
    error: null,

    selectedWithdrawal: null,
    detailsLoading: false,
    detailsError: null,

    actionLoading: null,
    actionError: null,
};

export const fetchWithdrawals = createAsyncThunk<
    Awaited<ReturnType<typeof getWithdrawals>>,
    void,
    { rejectValue: string }
>("withdrawal/fetchWithdrawals", async (_, { rejectWithValue }) => {
    try {
        return await getWithdrawals();
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch withdrawals");
    }
});

export const fetchWithdrawalDetails = createAsyncThunk<
    Awaited<ReturnType<typeof getWithdrawalDetails>>,
    number,
    { rejectValue: string }
>("withdrawal/fetchWithdrawalDetails", async (transaction_id, { rejectWithValue }) => {
    try {
        return await getWithdrawalDetails(transaction_id);
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch withdrawal details");
    }
});

export const approveWithdrawalThunk = createAsyncThunk<
    { transaction_id: number },
    number,
    { rejectValue: string }
>("withdrawal/approve", async (transaction_id, { rejectWithValue }) => {
    try {
        await approveWithdrawal(transaction_id);
        return { transaction_id };
    } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || error?.message || "Failed to approve withdrawal");
    }
});

export const rejectWithdrawalThunk = createAsyncThunk<
    { transaction_id: number },
    number,
    { rejectValue: string }
>("withdrawal/reject", async (transaction_id, { rejectWithValue }) => {
    try {
        await rejectWithdrawal(transaction_id);
        return { transaction_id };
    } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || error?.message || "Failed to reject withdrawal");
    }
});

const withdrawalSlice = createSlice({
    name: "withdrawal",
    initialState,
    reducers: {
        clearActionError: (state) => {
            state.actionError = null;
        },
        clearSelectedWithdrawal: (state) => {
            state.selectedWithdrawal = null;
            state.detailsError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWithdrawals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWithdrawals.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) state.withdrawals = action.payload.data;
            })
            .addCase(fetchWithdrawals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch withdrawals";
            });

        builder
            .addCase(fetchWithdrawalDetails.pending, (state) => {
                state.detailsLoading = true;
                state.detailsError = null;
                state.selectedWithdrawal = null;
            })
            .addCase(fetchWithdrawalDetails.fulfilled, (state, action) => {
                state.detailsLoading = false;
                if (action.payload.success) state.selectedWithdrawal = action.payload.data;
            })
            .addCase(fetchWithdrawalDetails.rejected, (state, action) => {
                state.detailsLoading = false;
                state.detailsError = action.payload || "Failed to fetch withdrawal details";
            });

        builder
            .addCase(approveWithdrawalThunk.pending, (state) => {
                state.actionLoading = "approve";
                state.actionError = null;
            })
            .addCase(approveWithdrawalThunk.fulfilled, (state, action) => {
                state.actionLoading = null;
                if (state.selectedWithdrawal?.transaction_id === action.payload.transaction_id) {
                    state.selectedWithdrawal.success = "approved";
                }
            })
            .addCase(approveWithdrawalThunk.rejected, (state, action) => {
                state.actionLoading = null;
                state.actionError = action.payload || "Failed to approve withdrawal";
            });

        builder
            .addCase(rejectWithdrawalThunk.pending, (state) => {
                state.actionLoading = "reject";
                state.actionError = null;
            })
            .addCase(rejectWithdrawalThunk.fulfilled, (state, action) => {
                state.actionLoading = null;
                if (state.selectedWithdrawal?.transaction_id === action.payload.transaction_id) {
                    state.selectedWithdrawal.success = "rejected";
                }
            })
            .addCase(rejectWithdrawalThunk.rejected, (state, action) => {
                state.actionLoading = null;
                state.actionError = action.payload || "Failed to reject withdrawal";
            });
    },
});

export const { clearActionError, clearSelectedWithdrawal } = withdrawalSlice.actions;
export default withdrawalSlice.reducer;
