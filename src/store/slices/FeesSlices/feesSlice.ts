import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import { getPlatformFees } from "@/store/api/FeesApi/getPlatformFees.api";
import { getPlatformFeeByType } from "@/store/api/FeesApi/getPlatformFeeByType.api";
import { addPlatformFee } from "@/store/api/FeesApi/addPlatformFee.api";
import { updatePlatformFee } from "@/store/api/FeesApi/updatePlatformFee.api";
import { deletePlatformFee } from "@/store/api/FeesApi/deletePlatformFee.api";

import type {
    PlatformFee,
    AddPlatformFeePayload,
    UpdatePlatformFeePayload,
} from "@/types/FeesTypes/fees.types";

interface FeesState {
    fees: PlatformFee[];
    loading: boolean;
    error: string | null;

    selectedFee: PlatformFee | null;
    selectedFeeLoading: boolean;
    selectedFeeError: string | null;

    addLoading: boolean;
    addError: string | null;
    addSuccess: boolean;

    updateLoading: boolean;
    updateError: string | null;
    updateSuccess: boolean;

    deleteLoading: boolean;
    deleteError: string | null;
}

const initialState: FeesState = {
    fees: [],
    loading: false,
    error: null,

    selectedFee: null,
    selectedFeeLoading: false,
    selectedFeeError: null,

    addLoading: false,
    addError: null,
    addSuccess: false,

    updateLoading: false,
    updateError: null,
    updateSuccess: false,

    deleteLoading: false,
    deleteError: null,
};


export const fetchPlatformFees =
    createAsyncThunk<
        Awaited<ReturnType<typeof getPlatformFees>>,
        void,
        { rejectValue: string }
    >(
        "fees/fetchPlatformFees",
        async (_, { rejectWithValue }) => {
            try {
                return await getPlatformFees();
            } catch (error) {
                return rejectWithValue(
                    error instanceof Error ? error.message : "Failed to fetch platform fees"
                );
            }
        }
    );


export const fetchPlatformFeeByType =
    createAsyncThunk<
        Awaited<ReturnType<typeof getPlatformFeeByType>>,
        string,
        { rejectValue: string }
    >(
        "fees/fetchPlatformFeeByType",
        async (feeType, { rejectWithValue }) => {
            try {
                return await getPlatformFeeByType(feeType);
            } catch (error) {
                return rejectWithValue(
                    error instanceof Error ? error.message : "Failed to fetch fee details"
                );
            }
        }
    );


export const createPlatformFee =
    createAsyncThunk<
        Awaited<ReturnType<typeof addPlatformFee>>,
        AddPlatformFeePayload,
        { rejectValue: string }
    >(
        "fees/createPlatformFee",
        async (payload, { rejectWithValue }) => {
            try {
                return await addPlatformFee(payload);
            } catch (error: any) {
                return rejectWithValue(
                    error?.response?.data?.message || error?.message || "Failed to add platform fee"
                );
            }
        }
    );


export const editPlatformFee =
    createAsyncThunk<
        Awaited<ReturnType<typeof updatePlatformFee>>,
        UpdatePlatformFeePayload,
        { rejectValue: string }
    >(
        "fees/editPlatformFee",
        async (payload, { rejectWithValue }) => {
            try {
                return await updatePlatformFee(payload);
            } catch (error: any) {
                return rejectWithValue(
                    error?.response?.data?.message || error?.message || "Failed to update platform fee"
                );
            }
        }
    );


export const removePlatformFee =
    createAsyncThunk<
        { feeType: string },
        string,
        { rejectValue: string }
    >(
        "fees/removePlatformFee",
        async (feeType, { rejectWithValue }) => {
            try {
                await deletePlatformFee(feeType);
                return { feeType };
            } catch (error: any) {
                return rejectWithValue(
                    error?.response?.data?.message || error?.message || "Failed to delete platform fee"
                );
            }
        }
    );


const feesSlice = createSlice({
    name: "fees",
    initialState,
    reducers: {
        clearFeesError: (state) => {
            state.error = null;
        },
        clearAddFeeState: (state) => {
            state.addError = null;
            state.addSuccess = false;
        },
        clearUpdateFeeState: (state) => {
            state.updateError = null;
            state.updateSuccess = false;
        },
        clearSelectedFee: (state) => {
            state.selectedFee = null;
            state.selectedFeeError = null;
        },
        clearDeleteError: (state) => {
            state.deleteError = null;
        },
    },
    extraReducers: (builder) => {

        /* FETCH ALL */
        builder
            .addCase(fetchPlatformFees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlatformFees.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.fees = action.payload.data;
                }
            })
            .addCase(fetchPlatformFees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch platform fees";
            });

        /* FETCH BY TYPE */
        builder
            .addCase(fetchPlatformFeeByType.pending, (state) => {
                state.selectedFeeLoading = true;
                state.selectedFeeError = null;
                state.selectedFee = null;
            })
            .addCase(fetchPlatformFeeByType.fulfilled, (state, action) => {
                state.selectedFeeLoading = false;
                if (action.payload.success) {
                    state.selectedFee = action.payload.data;
                }
            })
            .addCase(fetchPlatformFeeByType.rejected, (state, action) => {
                state.selectedFeeLoading = false;
                state.selectedFeeError = action.payload || "Failed to fetch fee details";
            });

        /* ADD */
        builder
            .addCase(createPlatformFee.pending, (state) => {
                state.addLoading = true;
                state.addError = null;
                state.addSuccess = false;
            })
            .addCase(createPlatformFee.fulfilled, (state, action) => {
                state.addLoading = false;
                if (action.payload.success) {
                    state.addSuccess = true;
                    state.fees.push(action.payload.data);
                }
            })
            .addCase(createPlatformFee.rejected, (state, action) => {
                state.addLoading = false;
                state.addError = action.payload || "Failed to add platform fee";
            });

        /* UPDATE */
        builder
            .addCase(editPlatformFee.pending, (state) => {
                state.updateLoading = true;
                state.updateError = null;
                state.updateSuccess = false;
            })
            .addCase(editPlatformFee.fulfilled, (state, action) => {
                state.updateLoading = false;
                if (action.payload.success) {
                    state.updateSuccess = true;
                    const updated = action.payload.data;
                    const idx = state.fees.findIndex(
                        (f) => f.fee_type === updated.fee_type
                    );
                    if (idx !== -1) {
                        state.fees[idx] = updated;
                    }
                }
            })
            .addCase(editPlatformFee.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError = action.payload || "Failed to update platform fee";
            });

        /* DELETE */
        builder
            .addCase(removePlatformFee.pending, (state) => {
                state.deleteLoading = true;
                state.deleteError = null;
            })
            .addCase(removePlatformFee.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.fees = state.fees.filter(
                    (f) => f.fee_type !== action.payload.feeType
                );
            })
            .addCase(removePlatformFee.rejected, (state, action) => {
                state.deleteLoading = false;
                state.deleteError = action.payload || "Failed to delete platform fee";
            });
    },
});

export const {
    clearFeesError,
    clearAddFeeState,
    clearUpdateFeeState,
    clearSelectedFee,
    clearDeleteError,
} = feesSlice.actions;

export default feesSlice.reducer;
