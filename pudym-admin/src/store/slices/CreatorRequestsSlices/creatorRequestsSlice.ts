import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getCreatorRequests,
} from "@/store/api/CreatorRequestsApi/getCreatorRequests.api";

import {
    getCreatorRequestStats,
} from "@/store/api/CreatorRequestsApi/getCreatorRequestStats.api";

import {
    getCreatorRequestDetails,
} from "@/store/api/CreatorRequestsApi/getCreatorRequestDetails.api";

import type {
    CreatorRequestListItem,
    CreatorRequestsPagination,
} from "@/types/CreatorRequestsTypes/getCreatorRequests.types";

import type {
    CreatorRequestStats,
} from "@/types/CreatorRequestsTypes/getCreatorRequestStats.types";

import type {
    CreatorRequestDetails,
} from "@/types/CreatorRequestsTypes/getCreatorRequestDetails.types";
import {
    updateCreatorRequestStatus,
} from "@/store/api/CreatorRequestsApi/updateCreatorRequestStatus.api";

import type {
    CreatorRequestStatus,
} from "@/types/CreatorRequestsTypes/getCreatorRequests.types";

interface CreatorRequestsState {
    requests: CreatorRequestListItem[];

    pagination: CreatorRequestsPagination;

    stats: CreatorRequestStats;

    selectedRequest: CreatorRequestDetails | null;

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

const initialState: CreatorRequestsState = {
    requests: [],

    pagination: {
        total_pages: 0,
        total_records: 0,
        current_page: 1,
        records_per_page: 10,
    },

    stats: {
        total_requests: 0,
        under_review: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
    },

    selectedRequest: null,

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


/**
 * ==========================================
 * GET CREATOR REQUESTS
 * ==========================================
 */

export const fetchCreatorRequests =
    createAsyncThunk<
        Awaited<
            ReturnType<typeof getCreatorRequests>
        >,
        {
            page?: number;
            pageSize?: number;
            search?: string;
        },
        { rejectValue: string }
    >(
        "creatorRequests/fetchCreatorRequests",

        async (
            params,
            { rejectWithValue }
        ) => {
            try {
                return await getCreatorRequests(
                    params
                );
            } catch (error) {
                return rejectWithValue(
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch creator requests"
                );
            }
        }
    );


/**
 * ==========================================
 * GET CREATOR REQUEST STATS
 * ==========================================
 */

export const fetchCreatorRequestStats =
    createAsyncThunk<
        Awaited<
            ReturnType<
                typeof getCreatorRequestStats
            >
        >,
        void,
        { rejectValue: string }
    >(
        "creatorRequests/fetchCreatorRequestStats",

        async (
            _,
            { rejectWithValue }
        ) => {
            try {
                return await getCreatorRequestStats();
            } catch (error) {
                return rejectWithValue(
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch creator request statistics"
                );
            }
        }
    );


/**
* ==========================================
* UPDATE CREATOR REQUEST STATUS
* ==========================================
*/

export const changeCreatorRequestStatus =
    createAsyncThunk<
        Awaited<
            ReturnType<typeof updateCreatorRequestStatus>
        >,
        {
            userId: number;
            status: CreatorRequestStatus;
            admin_text?: string;
        },
        { rejectValue: string }
    >(
        "creatorRequests/changeCreatorRequestStatus",

        async (
            {
                userId,
                status,
                admin_text = "",
            },
            { rejectWithValue }
        ) => {
            try {
                return await updateCreatorRequestStatus(
                    userId,
                    status,
                    admin_text
                );
            } catch (error: any) {
                return rejectWithValue(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to update creator request status"
                );
            }
        }
    );
/**
 * ==========================================
 * GET CREATOR REQUEST DETAILS
 * ==========================================
 */

export const fetchCreatorRequestDetails =
    createAsyncThunk<
        Awaited<
            ReturnType<
                typeof getCreatorRequestDetails
            >
        >,
        number,
        { rejectValue: string }
    >(
        "creatorRequests/fetchCreatorRequestDetails",

        async (
            userId,
            { rejectWithValue }
        ) => {
            try {
                return await getCreatorRequestDetails(
                    userId
                );
            } catch (error) {
                return rejectWithValue(
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch creator request details"
                );
            }
        }
    );


const creatorRequestsSlice =
    createSlice({

        name: "creatorRequests",

        initialState,

        reducers: {

            clearCreatorRequestsError: (
                state
            ) => {
                state.error = null;
            },

            clearCreatorRequestStatsError: (
                state
            ) => {
                state.statsError = null;
            },

            clearSelectedCreatorRequest: (
                state
            ) => {
                state.selectedRequest = null;
                state.detailsError = null;
            },

            clearCreatorRequestDetailsError: (
                state
            ) => {
                state.detailsError = null;
            },

            clearCreatorRequestStatusError: (
                state
            ) => {
                state.statusError = null;
            },
        },

        extraReducers: (
            builder
        ) => {

            /**
             * ==========================================
             * CREATOR REQUEST LIST
             * ==========================================
             */

            builder
                .addCase(
                    fetchCreatorRequests.pending,
                    (state) => {

                        state.loading = true;

                        state.error = null;
                    }
                )

                .addCase(
                    fetchCreatorRequests.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.loading = false;

                        if (
                            action.payload.success
                        ) {

                            state.requests =
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
                    fetchCreatorRequests.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.loading = false;

                        state.error =
                            action.payload ||
                            "Failed to fetch creator requests";
                    }
                );


            /**
             * ==========================================
             * CREATOR REQUEST STATS
             * ==========================================
             */

            builder
                .addCase(
                    fetchCreatorRequestStats.pending,
                    (state) => {

                        state.statsLoading = true;

                        state.statsError = null;
                    }
                )

                .addCase(
                    fetchCreatorRequestStats.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.statsLoading = false;

                        if (
                            action.payload.success
                        ) {

                            state.stats =
                                action.payload.data;
                        }
                    }
                )

                .addCase(
                    fetchCreatorRequestStats.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.statsLoading = false;

                        state.statsError =
                            action.payload ||
                            "Failed to fetch creator request statistics";
                    }
                );

            /**
             * ==========================================
             * UPDATE CREATOR REQUEST STATUS
             * ==========================================
             */

            builder
                .addCase(
                    changeCreatorRequestStatus.pending,
                    (state, action) => {
                        state.statusLoading = true;

                        state.statusLoadingUserId =
                            action.meta.arg.userId;

                        state.statusError = null;
                    }
                )

                .addCase(
                    changeCreatorRequestStatus.fulfilled,
                    (state, action) => {
                        state.statusLoading = false;

                        state.statusLoadingUserId = null;

                        if (!action.payload.success) {
                            return;
                        }

                        const updatedRequest =
                            action.payload.data;

                        /*
                         * ==========================================
                         * UPDATE REQUEST IN LIST
                         * ==========================================
                         */

                        const request =
                            state.requests.find(
                                (item) =>
                                    item.user_id ===
                                    updatedRequest.user_id
                            );

                        if (request) {
                            request.status =
                                updatedRequest.status;

                            request.admin_text =
                                updatedRequest.admin_text;

                            request.role =
                                updatedRequest.role;

                            request.profile_verification_status =
                                updatedRequest.profile_verification_status;

                            const statusMap = {
                                under_review: "0",
                                approved: "1",
                                rejected: "2",
                                pending: "3",
                            } as const;

                            request.admin_approve =
                                statusMap[
                                updatedRequest.status as keyof typeof statusMap
                                ];
                        }

                        /*
                         * ==========================================
                         * UPDATE CURRENTLY OPENED REQUEST
                         * ==========================================
                         */

                        const selected = state.selectedRequest;

                        if (
                            selected !== null &&
                            selected.user_id ===
                            updatedRequest.user_id
                        ) {
                            selected.status =
                                updatedRequest.status;

                            selected.admin_text =
                                updatedRequest.admin_text;

                            selected.role =
                                updatedRequest.role;

                            selected.profile_verification_status =
                                updatedRequest.profile_verification_status;

                            const statusMap = {
                                under_review: "0",
                                approved: "1",
                                rejected: "2",
                                pending: "3",
                            } as const;

                            selected.admin_approve =
                                statusMap[
                                updatedRequest.status as keyof typeof statusMap
                                ];
                        }
                    }
                )

                .addCase(
                    changeCreatorRequestStatus.rejected,
                    (state, action) => {
                        state.statusLoading = false;

                        state.statusLoadingUserId = null;

                        state.statusError =
                            action.payload ||
                            "Failed to update creator request status";
                    }
                );
            /**
             * ==========================================
             * CREATOR REQUEST DETAILS
             * ==========================================
             */

            builder
                .addCase(
                    fetchCreatorRequestDetails.pending,
                    (state) => {

                        state.detailsLoading = true;

                        state.detailsError = null;

                        state.selectedRequest = null;
                    }
                )

                .addCase(
                    fetchCreatorRequestDetails.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.detailsLoading = false;

                        if (
                            action.payload.success
                        ) {

                            state.selectedRequest =
                                action.payload.data;
                        }
                    }
                )

                .addCase(
                    fetchCreatorRequestDetails.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.detailsLoading = false;

                        state.detailsError =
                            action.payload ||
                            "Failed to fetch creator request details";
                    }
                );
        },
    });


export const {
    clearCreatorRequestsError,
    clearCreatorRequestStatsError,
    clearSelectedCreatorRequest,
    clearCreatorRequestDetailsError,
    clearCreatorRequestStatusError,
} = creatorRequestsSlice.actions;


export default creatorRequestsSlice.reducer;