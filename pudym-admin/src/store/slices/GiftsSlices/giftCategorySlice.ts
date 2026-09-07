import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import { getGiftCategories } from "@/store/api/GiftsApi/getGiftCategories.api";
import { createGiftCategory } from "@/store/api/GiftsApi/createGiftCategory.api";
import { updateGiftCategory } from "@/store/api/GiftsApi/updateGiftCategory.api";
import { updateGiftCategoryStatus } from "@/store/api/GiftsApi/updateGiftCategoryStatus.api";
import type {
    GiftCategory,
    GiftCategoriesPagination,
    GetGiftCategoriesParams,
    CreateGiftCategoryPayload,
    UpdateGiftCategoryPayload,
    UpdateGiftCategoryStatusPayload,
} from "@/types/GiftsTypes/giftCategory.types";

interface GiftCategoryState {
    giftCategories: GiftCategory[];

    pagination: GiftCategoriesPagination;

    loading: boolean;

    createLoading: boolean;

    updateLoading: boolean;

    statusLoading: boolean;

    error: string | null;

    createError: string | null;

    updateError: string | null;

    statusError: string | null;
}

const initialState: GiftCategoryState = {
    giftCategories: [],

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
 * GET GIFT CATEGORIES
 * ==========================================
 */

export const fetchGiftCategories = createAsyncThunk<
    Awaited<ReturnType<typeof getGiftCategories>>,
    GetGiftCategoriesParams,
    { rejectValue: string }
>(
    "giftCategories/fetchGiftCategories",
    async (params, { rejectWithValue }) => {
        try {
            return await getGiftCategories(params);
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch gift categories"
            );
        }
    }
);


/*
 * ==========================================
 * CREATE GIFT CATEGORY
 * ==========================================
 */

export const addGiftCategory = createAsyncThunk<
    Awaited<ReturnType<typeof createGiftCategory>>,
    CreateGiftCategoryPayload,
    { rejectValue: string }
>(
    "giftCategories/addGiftCategory",
    async (payload, { rejectWithValue }) => {
        try {
            return await createGiftCategory(payload);
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to create gift category"
            );
        }
    }
);


/*
 * ==========================================
 * UPDATE GIFT CATEGORY
 * ==========================================
 */

export const editGiftCategory = createAsyncThunk<
    Awaited<ReturnType<typeof updateGiftCategory>>,
    {
        giftCategoryId: number;
        payload: UpdateGiftCategoryPayload;
    },
    { rejectValue: string }
>(
    "giftCategories/editGiftCategory",
    async (
        { giftCategoryId, payload },
        { rejectWithValue }
    ) => {
        try {
            return await updateGiftCategory(
                giftCategoryId,
                payload
            );
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to update gift category"
            );
        }
    }
);

/*
 * ==========================================
 * UPDATE GIFT CATEGORY STATUS
 * ==========================================
 */

export const toggleGiftCategoryStatus = createAsyncThunk<
    Awaited<ReturnType<typeof updateGiftCategoryStatus>>,
    {
        giftCategoryId: number;
        payload: UpdateGiftCategoryStatusPayload;
    },
    { rejectValue: string }
>(
    "giftCategories/toggleGiftCategoryStatus",
    async (
        { giftCategoryId, payload },
        { rejectWithValue }
    ) => {
        try {
            return await updateGiftCategoryStatus(
                giftCategoryId,
                payload
            );
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to update gift category status"
            );
        }
    }
);
const giftCategorySlice = createSlice({
    name: "giftCategories",

    initialState,

    reducers: {
        clearGiftCategoryError: (state) => {
            state.error = null;
        },

        clearCreateGiftCategoryError: (state) => {
            state.createError = null;
        },

        clearUpdateGiftCategoryError: (state) => {
            state.updateError = null;
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
                fetchGiftCategories.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                fetchGiftCategories.fulfilled,
                (state, action) => {
                    state.loading = false;

                    if (action.payload.status) {
                        state.giftCategories =
                            action.payload.data.Records;

                        state.pagination =
                            action.payload.data.Pagination;
                    }
                }
            )

            .addCase(
                fetchGiftCategories.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch gift categories";
                }
            );


        /*
         * ==========================================
         * CREATE
         * ==========================================
         */

        builder
            .addCase(
                addGiftCategory.pending,
                (state) => {
                    state.createLoading = true;
                    state.createError = null;
                }
            )

            .addCase(
                addGiftCategory.fulfilled,
                (state, action) => {
                    state.createLoading = false;

                    if (!action.payload.status) {
                        state.createError =
                            action.payload.message;
                    }
                }
            )

            .addCase(
                addGiftCategory.rejected,
                (state, action) => {
                    state.createLoading = false;

                    state.createError =
                        action.payload ||
                        "Failed to create gift category";
                }
            );


        /*
         * ==========================================
         * UPDATE
         * ==========================================
         */

        builder
            .addCase(
                editGiftCategory.pending,
                (state) => {
                    state.updateLoading = true;
                    state.updateError = null;
                }
            )

            .addCase(
                editGiftCategory.fulfilled,
                (state, action) => {
                    state.updateLoading = false;

                    if (!action.payload.status) {
                        state.updateError =
                            action.payload.message;
                    }
                }
            )

            .addCase(
                editGiftCategory.rejected,
                (state, action) => {
                    state.updateLoading = false;

                    state.updateError =
                        action.payload ||
                        "Failed to update gift category";
                }
            );
        /*
* ==========================================
* UPDATE STATUS
* ==========================================
*/

        builder
            .addCase(
                toggleGiftCategoryStatus.pending,
                (state) => {
                    state.statusLoading = true;
                    state.statusError = null;
                }
            )

            .addCase(
                toggleGiftCategoryStatus.fulfilled,
                (state, action) => {
                    state.statusLoading = false;

                    if (action.payload.status) {
                        state.statusError = null;

                        const updatedCategory =
                            state.giftCategories.find(
                                (category) =>
                                    category.gift_category_id ===
                                    Number(
                                        action.meta.arg.giftCategoryId
                                    )
                            );

                        if (updatedCategory) {
                            updatedCategory.status =
                                action.meta.arg.payload.status;
                        }
                    } else {
                        state.statusError =
                            action.payload.message;
                    }
                }
            )
            .addCase(
                toggleGiftCategoryStatus.rejected,
                (state, action) => {
                    state.statusLoading = false;

                    state.statusError =
                        action.payload ||
                        "Failed to update gift category status";
                }
            );
    },
});

export const {
    clearGiftCategoryError,
    clearCreateGiftCategoryError,
    clearUpdateGiftCategoryError,
} = giftCategorySlice.actions;

export default giftCategorySlice.reducer;