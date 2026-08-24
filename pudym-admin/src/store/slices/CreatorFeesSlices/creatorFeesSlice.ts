import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getCreatorFees } from "@/store/api/CreatorFeesApi/getCreatorFees.api";
import { addCreatorFee } from "@/store/api/CreatorFeesApi/addCreatorFee.api";
import { updateCreatorFee } from "@/store/api/CreatorFeesApi/updateCreatorFee.api";

import type {
    CreatorFee,
    AddCreatorFeePayload,
    UpdateCreatorFeePayload,
} from "@/types/CreatorFeesTypes/creatorFees.types";

interface CreatorFeesState {
    creatorFees: CreatorFee[];
    loading: boolean;
    error: string | null;

    addLoading: boolean;
    addError: string | null;
    addSuccess: boolean;

    updateLoading: boolean;
    updateError: string | null;
    updateSuccess: boolean;
}

const initialState: CreatorFeesState = {
    creatorFees: [],
    loading: false,
    error: null,

    addLoading: false,
    addError: null,
    addSuccess: false,

    updateLoading: false,
    updateError: null,
    updateSuccess: false,
};


export const fetchCreatorFees =
    createAsyncThunk<
        Awaited<ReturnType<typeof getCreatorFees>>,
        void,
        { rejectValue: string }
    >(
        "creatorFees/fetchCreatorFees",
        async (_, { rejectWithValue }) => {
            try {
                return await getCreatorFees();
            } catch (error) {
                return rejectWithValue(
                    error instanceof Error ? error.message : "Failed to fetch creator fees"
                );
            }
        }
    );


export const createCreatorFee =
    createAsyncThunk<
        Awaited<ReturnType<typeof addCreatorFee>>,
        AddCreatorFeePayload,
        { rejectValue: string }
    >(
        "creatorFees/createCreatorFee",
        async (payload, { rejectWithValue }) => {
            try {
                return await addCreatorFee(payload);
            } catch (error: any) {
                return rejectWithValue(
                    error?.response?.data?.message || error?.message || "Failed to add creator fee"
                );
            }
        }
    );


export const editCreatorFee =
    createAsyncThunk<
        Awaited<ReturnType<typeof updateCreatorFee>>,
        UpdateCreatorFeePayload,
        { rejectValue: string }
    >(
        "creatorFees/editCreatorFee",
        async (payload, { rejectWithValue }) => {
            try {
                return await updateCreatorFee(payload);
            } catch (error: any) {
                return rejectWithValue(
                    error?.response?.data?.message || error?.message || "Failed to update creator fee"
                );
            }
        }
    );


const creatorFeesSlice = createSlice({
    name: "creatorFees",
    initialState,
    reducers: {
        clearCreatorFeesError: (state) => {
            state.error = null;
        },
        clearAddCreatorFeeState: (state) => {
            state.addError = null;
            state.addSuccess = false;
        },
        clearUpdateCreatorFeeState: (state) => {
            state.updateError = null;
            state.updateSuccess = false;
        },
    },
    extraReducers: (builder) => {

        /* FETCH LIST */
        builder
            .addCase(fetchCreatorFees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCreatorFees.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.creatorFees = action.payload.data;
                }
            })
            .addCase(fetchCreatorFees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch creator fees";
            });

        /* ADD */
        builder
            .addCase(createCreatorFee.pending, (state) => {
                state.addLoading = true;
                state.addError = null;
                state.addSuccess = false;
            })
            .addCase(createCreatorFee.fulfilled, (state, action) => {
                state.addLoading = false;
                if (action.payload.success) {
                    state.addSuccess = true;
                    state.creatorFees.unshift(action.payload.data);
                }
            })
            .addCase(createCreatorFee.rejected, (state, action) => {
                state.addLoading = false;
                state.addError = action.payload || "Failed to add creator fee";
            });

        /* UPDATE */
        builder
            .addCase(editCreatorFee.pending, (state) => {
                state.updateLoading = true;
                state.updateError = null;
                state.updateSuccess = false;
            })
            .addCase(editCreatorFee.fulfilled, (state, action) => {
                state.updateLoading = false;
                if (action.payload.success) {
                    state.updateSuccess = true;
                    const updated = action.payload.data;
                    const idx = state.creatorFees.findIndex(
                        (f) => f.creator_fee_id === updated.creator_fee_id
                    );
                    if (idx !== -1) {
                        state.creatorFees[idx] = updated;
                    }
                }
            })
            .addCase(editCreatorFee.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError = action.payload || "Failed to update creator fee";
            });
    },
});

export const {
    clearCreatorFeesError,
    clearAddCreatorFeeState,
    clearUpdateCreatorFeeState,
} = creatorFeesSlice.actions;

export default creatorFeesSlice.reducer;
