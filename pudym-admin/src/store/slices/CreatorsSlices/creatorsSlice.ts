import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getCreators,
} from "@/store/api/CreatorsApi/getCreators.api";

import {
    getCreatorStats,
} from "@/store/api/CreatorsApi/getCreatorStats.api";

import {
    getCreatorDetails,
} from "@/store/api/CreatorsApi/getCreatorDetails.api";

import {
    updateCreatorStatus,
} from "@/store/api/CreatorsApi/updateCreatorStatus.api";

import type {
    CreatorListItem,
    CreatorsPagination,
    CreatorStatus,
} from "@/types/CreatorsTypes/getCreators.types";

import type {
    CreatorStats,
} from "@/types/CreatorsTypes/getCreatorStats.types";

import type {
    CreatorDetails,
} from "@/types/CreatorsTypes/getCreatorDetails.types";


/*
 * ==========================================
 * STATE
 * ==========================================
 */

interface CreatorsState {

    creators: CreatorListItem[];

    pagination: CreatorsPagination;

    stats: CreatorStats;

    selectedCreator: CreatorDetails | null;

    loading: boolean;

    statsLoading: boolean;

    detailsLoading: boolean;

    statusLoading: boolean;

    statusLoadingUserId: number | null;

    error: string | null;

    statsError: string | null;

    detailsError: string | null;

    statusError: string | null;
}


/*
 * ==========================================
 * INITIAL STATE
 * ==========================================
 */

const initialState: CreatorsState = {

    creators: [],

    pagination: {
        total_pages: 0,
        total_records: 0,
        current_page: 1,
        records_per_page: 10,
    },

    stats: {
        total_creators: 0,
        active_creators: 0,
        deactivated_creators: 0,
    },

    selectedCreator: null,

    loading: false,

    statsLoading: false,

    detailsLoading: false,

    statusLoading: false,

    statusLoadingUserId: null,

    error: null,

    statsError: null,

    detailsError: null,

    statusError: null,
};


/*
 * ==========================================
 * GET CREATORS
 * ==========================================
 */

export const fetchCreators =
    createAsyncThunk<
        Awaited<
            ReturnType<typeof getCreators>
        >,
        {
            page?: number;
            pageSize?: number;
            search?: string;
            status?: CreatorStatus | "";
        },
        { rejectValue: string }
    >(
        "creators/fetchCreators",

        async (
            params,
            { rejectWithValue }
        ) => {

            try {

                return await getCreators(
                    params
                );

            } catch (error) {

                return rejectWithValue(
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch creators"
                );
            }
        }
    );


/*
 * ==========================================
 * GET CREATOR STATS
 * ==========================================
 */

export const fetchCreatorStats =
    createAsyncThunk<
        Awaited<
            ReturnType<
                typeof getCreatorStats
            >
        >,
        void,
        { rejectValue: string }
    >(
        "creators/fetchCreatorStats",

        async (
            _,
            { rejectWithValue }
        ) => {

            try {

                return await getCreatorStats();

            } catch (error) {

                return rejectWithValue(
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch creator statistics"
                );
            }
        }
    );


/*
 * ==========================================
 * GET CREATOR DETAILS
 * ==========================================
 */

export const fetchCreatorDetails =
    createAsyncThunk<
        Awaited<
            ReturnType<
                typeof getCreatorDetails
            >
        >,
        number,
        { rejectValue: string }
    >(
        "creators/fetchCreatorDetails",

        async (
            userId,
            { rejectWithValue }
        ) => {

            try {

                return await getCreatorDetails(
                    userId
                );

            } catch (error) {

                return rejectWithValue(
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch creator details"
                );
            }
        }
    );


/*
 * ==========================================
 * UPDATE CREATOR STATUS
 * ==========================================
 */

export const changeCreatorStatus =
    createAsyncThunk<
        Awaited<
            ReturnType<
                typeof updateCreatorStatus
            >
        >,
        {
            userId: number;
            is_deactivated: boolean;
        },
        { rejectValue: string }
    >(
        "creators/changeCreatorStatus",

        async (
            {
                userId,
                is_deactivated,
            },
            { rejectWithValue }
        ) => {

            try {

                return await updateCreatorStatus(
                    userId,
                    is_deactivated
                );

            } catch (error: any) {

                return rejectWithValue(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to update creator status"
                );
            }
        }
    );


/*
 * ==========================================
 * SLICE
 * ==========================================
 */

const creatorsSlice =
    createSlice({

        name: "creators",

        initialState,

        reducers: {

            clearCreatorsError: (
                state
            ) => {

                state.error = null;
            },

            clearCreatorStatsError: (
                state
            ) => {

                state.statsError = null;
            },

            clearSelectedCreator: (
                state
            ) => {

                state.selectedCreator =
                    null;

                state.detailsError =
                    null;
            },

            clearCreatorDetailsError: (
                state
            ) => {

                state.detailsError =
                    null;
            },

            clearCreatorStatusError: (
                state
            ) => {

                state.statusError =
                    null;
            },
        },


        /*
         * ==========================================
         * EXTRA REDUCERS
         * ==========================================
         */

        extraReducers: (
            builder
        ) => {


            /*
             * ==========================================
             * CREATOR LIST
             * ==========================================
             */

            builder

                .addCase(
                    fetchCreators.pending,
                    (
                        state
                    ) => {

                        state.loading =
                            true;

                        state.error =
                            null;
                    }
                )

                .addCase(
                    fetchCreators.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.loading =
                            false;

                        if (
                            action.payload.success
                        ) {

                            state.creators =
                                action.payload
                                    .data
                                    .Records;

                            state.pagination =
                                action.payload
                                    .data
                                    .Pagination;
                        }
                    }
                )

                .addCase(
                    fetchCreators.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.loading =
                            false;

                        state.error =
                            action.payload ||
                            "Failed to fetch creators";
                    }
                );


            /*
             * ==========================================
             * CREATOR STATS
             * ==========================================
             */

            builder

                .addCase(
                    fetchCreatorStats.pending,
                    (
                        state
                    ) => {

                        state.statsLoading =
                            true;

                        state.statsError =
                            null;
                    }
                )

                .addCase(
                    fetchCreatorStats.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.statsLoading =
                            false;

                        if (
                            action.payload.success
                        ) {

                            state.stats =
                                action.payload.data;
                        }
                    }
                )

                .addCase(
                    fetchCreatorStats.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.statsLoading =
                            false;

                        state.statsError =
                            action.payload ||
                            "Failed to fetch creator statistics";
                    }
                );


            /*
             * ==========================================
             * CREATOR DETAILS
             * ==========================================
             */

            builder

                .addCase(
                    fetchCreatorDetails.pending,
                    (
                        state
                    ) => {

                        state.detailsLoading =
                            true;

                        state.detailsError =
                            null;

                        state.selectedCreator =
                            null;
                    }
                )

                .addCase(
                    fetchCreatorDetails.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.detailsLoading =
                            false;

                        if (
                            action.payload.success
                        ) {

                            state.selectedCreator =
                                action.payload.data;
                        }
                    }
                )

                .addCase(
                    fetchCreatorDetails.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.detailsLoading =
                            false;

                        state.detailsError =
                            action.payload ||
                            "Failed to fetch creator details";
                    }
                );


            /*
             * ==========================================
             * UPDATE CREATOR STATUS
             * ==========================================
             */

            builder

                .addCase(
                    changeCreatorStatus.pending,
                    (
                        state,
                        action
                    ) => {

                        state.statusLoading =
                            true;

                        state.statusLoadingUserId =
                            action.meta.arg.userId;

                        state.statusError =
                            null;
                    }
                )

                .addCase(
                    changeCreatorStatus.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.statusLoading =
                            false;

                        state.statusLoadingUserId =
                            null;

                        if (
                            !action.payload.success
                        ) {
                            return;
                        }

                        const updatedCreator =
                            action.payload.data;


                        /*
 * ==========================================
 * UPDATE LIST ITEM
 * ==========================================
 */

                        const creator =
                            state.creators.find(
                                (item) =>
                                    item.user_id ===
                                    updatedCreator.user_id
                            );

                        if (creator) {

                            const wasDeactivated =
                                creator.is_deactivated;

                            const isNowDeactivated =
                                updatedCreator.is_deactivated;

                            /*
                             * Update statistics locally
                             * without refetching stats.
                             */
                            if (
                                wasDeactivated !==
                                isNowDeactivated
                            ) {

                                if (isNowDeactivated) {

                                    state.stats.active_creators -= 1;

                                    state.stats.deactivated_creators += 1;

                                } else {

                                    state.stats.active_creators += 1;

                                    state.stats.deactivated_creators -= 1;
                                }
                            }

                            creator.is_deactivated =
                                isNowDeactivated;

                            creator.status =
                                isNowDeactivated
                                    ? "deactivated"
                                    : "active";

                            creator.role =
                                updatedCreator.role;
                        }


                        /*
                         * ==========================================
                         * UPDATE OPENED CREATOR
                         * ==========================================
                         */

                        const selected =
                            state.selectedCreator;

                        if (
                            selected !== null &&
                            selected.user_id ===
                            updatedCreator.user_id
                        ) {

                            selected.is_deactivated =
                                updatedCreator
                                    .is_deactivated;

                            selected.status =
                                updatedCreator
                                    .is_deactivated
                                    ? "deactivated"
                                    : "active";

                            selected.role =
                                updatedCreator.role;
                        }
                    }
                )

                .addCase(
                    changeCreatorStatus.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.statusLoading =
                            false;

                        state.statusLoadingUserId =
                            null;

                        state.statusError =
                            action.payload ||
                            "Failed to update creator status";
                    }
                );
        },
    });


/*
 * ==========================================
 * ACTIONS
 * ==========================================
 */

export const {
    clearCreatorsError,
    clearCreatorStatsError,
    clearSelectedCreator,
    clearCreatorDetailsError,
    clearCreatorStatusError,
} = creatorsSlice.actions;


/*
 * ==========================================
 * REDUCER
 * ==========================================
 */

export default creatorsSlice.reducer;