import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import { getGifts } from "@/store/api/GiftsApi/getGifts.api";
import { createGift } from "@/store/api/GiftsApi/createGift.api";
import { updateGift } from "@/store/api/GiftsApi/updateGift.api";
import { updateGiftStatus } from "@/store/api/GiftsApi/toggleGiftStatus.api";

import type {
    Gift,
    GiftsPagination,
    GetGiftsParams,
    CreateGiftPayload,
    UpdateGiftPayload,
    UpdateGiftStatusPayload,
} from "@/types/GiftsTypes/gifts.types";

interface GiftsState {
    gifts: Gift[];

    pagination: GiftsPagination;

    loading: boolean;

    createLoading: boolean;

    updateLoading: boolean;

    statusLoading: boolean;

    error: string | null;

    createError: string | null;

    updateError: string | null;

    statusError: string | null;
}

const initialState: GiftsState = {
    gifts: [],

    pagination: {
        total_pages: 0,
        total_records: 0,
        current_page: 1,
        records_per_page: 10,
    },

    loading: false,

    createLoading: false,

    updateLoading: false,

    statusLoading: false,

    error: null,

    createError: null,

    updateError: null,

    statusError: null,
};


/*
 * ==========================================
 * GET GIFTS
 * ==========================================
 */

export const fetchGifts = createAsyncThunk<
    Awaited<ReturnType<typeof getGifts>>,
    GetGiftsParams,
    { rejectValue: string }
>(
    "gifts/fetchGifts",
    async (params, { rejectWithValue }) => {
        try {
            return await getGifts(params);
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch gifts"
            );
        }
    }
);


/*
 * ==========================================
 * CREATE GIFT
 * ==========================================
 */

export const addGift = createAsyncThunk<
    Awaited<ReturnType<typeof createGift>>,
    CreateGiftPayload,
    { rejectValue: string }
>(
    "gifts/addGift",
    async (payload, { rejectWithValue }) => {
        try {
            return await createGift(payload);
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to create gift"
            );
        }
    }
);


/*
 * ==========================================
 * UPDATE GIFT
 * ==========================================
 */

export const editGift = createAsyncThunk<
    Awaited<ReturnType<typeof updateGift>>,
    {
        giftId: number;
        payload: UpdateGiftPayload;
    },
    { rejectValue: string }
>(
    "gifts/editGift",
    async (
        { giftId, payload },
        { rejectWithValue }
    ) => {
        try {
            return await updateGift(
                giftId,
                payload
            );
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to update gift"
            );
        }
    }
);


/*
 * ==========================================
 * UPDATE GIFT STATUS
 * ==========================================
 */

export const toggleGiftStatus = createAsyncThunk<
    Awaited<ReturnType<typeof updateGiftStatus>>,
    {
        giftId: number;
        payload: UpdateGiftStatusPayload;
    },
    { rejectValue: string }
>(
    "gifts/toggleGiftStatus",
    async (
        { giftId, payload },
        { rejectWithValue }
    ) => {
        try {
            return await updateGiftStatus(
                giftId,
                payload
            );
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to update gift status"
            );
        }
    }
);


const giftsSlice = createSlice({
    name: "gifts",

    initialState,

    reducers: {
        clearGiftError: (state) => {
            state.error = null;
        },

        clearCreateGiftError: (state) => {
            state.createError = null;
        },

        clearUpdateGiftError: (state) => {
            state.updateError = null;
        },

        clearGiftStatusError: (state) => {
            state.statusError = null;
        },
    },

    extraReducers: (builder) => {

        /*
         * ==========================================
         * GET
         * ==========================================
         */

        builder
            .addCase(
                fetchGifts.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                fetchGifts.fulfilled,
                (state, action) => {
                    state.loading = false;

                    if (action.payload.status) {
                        state.gifts =
                            action.payload.data.Records;

                        state.pagination =
                            action.payload.data.Pagination;
                    }
                }
            )

            .addCase(
                fetchGifts.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch gifts";
                }
            );


        /*
         * ==========================================
         * CREATE
         * ==========================================
         */

        builder
            .addCase(
                addGift.pending,
                (state) => {
                    state.createLoading = true;
                    state.createError = null;
                }
            )

            .addCase(
                addGift.fulfilled,
                (state, action) => {
                    state.createLoading = false;

                    if (!action.payload.status) {
                        state.createError =
                            action.payload.message;
                    }
                }
            )

            .addCase(
                addGift.rejected,
                (state, action) => {
                    state.createLoading = false;

                    state.createError =
                        action.payload ||
                        "Failed to create gift";
                }
            );


        /*
         * ==========================================
         * UPDATE
         * ==========================================
         */

        builder
            .addCase(
                editGift.pending,
                (state) => {
                    state.updateLoading = true;
                    state.updateError = null;
                }
            )

            .addCase(
                editGift.fulfilled,
                (state, action) => {
                    state.updateLoading = false;

                    if (!action.payload.status) {
                        state.updateError =
                            action.payload.message;
                    }
                }
            )

            .addCase(
                editGift.rejected,
                (state, action) => {
                    state.updateLoading = false;

                    state.updateError =
                        action.payload ||
                        "Failed to update gift";
                }
            );


        /*
         * ==========================================
         * STATUS
         * ==========================================
         */

        builder
            .addCase(
                toggleGiftStatus.pending,
                (state) => {
                    state.statusLoading = true;
                    state.statusError = null;
                }
            )

            .addCase(
                toggleGiftStatus.fulfilled,
                (state, action) => {
                    state.statusLoading = false;

                    if (action.payload.status) {
                        state.statusError = null;

                        const giftId =
                            Number(
                                action.meta.arg.giftId
                            );

                        const gift =
                            state.gifts.find(
                                (item) =>
                                    item.gift_id === giftId
                            );

                        if (gift) {
                            gift.status =
                                action.meta.arg.payload.status;
                        }
                    } else {
                        state.statusError =
                            action.payload.message;
                    }
                }
            )

            .addCase(
                toggleGiftStatus.rejected,
                (state, action) => {
                    state.statusLoading = false;

                    state.statusError =
                        action.payload ||
                        "Failed to update gift status";
                }
            );
    },
});

export const {
    clearGiftError,
    clearCreateGiftError,
    clearUpdateGiftError,
    clearGiftStatusError,
} = giftsSlice.actions;

export default giftsSlice.reducer;