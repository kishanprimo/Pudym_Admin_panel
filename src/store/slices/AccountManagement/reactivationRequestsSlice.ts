import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getReactivationRequests,
} from "@/store/api/AccountManagement/getReactivationRequests.api";

import type {
    ReactivationRequest,
    ReactivationRequestsPagination,
    ReactivationRequestDetail,
} from "@/types/AccountManagementTypes/reactivationRequests.types";
import {
    getReactivationRequestDetail,
} from "@/store/api/AccountManagement/getReactivationRequestDetail.api";
import {
    approveReactivationRequest,
} from "@/store/api/AccountManagement/approveReactivationRequest.api";

import {
    rejectReactivationRequest,
} from "@/store/api/AccountManagement/rejectReactivationRequest.api";

interface ReactivationRequestsState {
    requests: ReactivationRequest[];

    pagination: ReactivationRequestsPagination;

    detail: ReactivationRequestDetail | null;

    loading: boolean;

    detailLoading: boolean;

    error: string | null;

    detailError: string | null;

    actionLoading: boolean;

    actionError: string | null;
}
const initialState: ReactivationRequestsState = {
    requests: [],

    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    },

    detail: null,

    loading: false,

    detailLoading: false,

    error: null,

    detailError: null,
    actionLoading: false,

    actionError: null,
};

/*
 * ==========================================
 * GET REACTIVATION REQUESTS
 * ==========================================
 */

export const fetchReactivationRequests =
    createAsyncThunk<
        Awaited<
            ReturnType<typeof getReactivationRequests>
        >,
        {
            page?: number;
            limit?: number;
        },
        { rejectValue: string }
    >(
        "reactivationRequests/fetchReactivationRequests",

        async (
            params,
            { rejectWithValue }
        ) => {
            try {
                return await getReactivationRequests(
                    params
                );
            } catch (error) {
                return rejectWithValue(
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch reactivation requests"
                );
            }
        }
    );

/*
* ==========================================
* GET REACTIVATION REQUEST DETAIL
* ==========================================
*/

export const fetchReactivationRequestDetail =
    createAsyncThunk<
        Awaited<
            ReturnType<
                typeof getReactivationRequestDetail
            >
        >,
        number,
        { rejectValue: string }
    >(
        "reactivationRequests/fetchReactivationRequestDetail",

        async (
            requestId,
            { rejectWithValue }
        ) => {
            try {
                return await getReactivationRequestDetail(
                    requestId
                );
            } catch (error) {
                return rejectWithValue(
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch reactivation request details"
                );
            }
        }
    );

/*
 * ==========================================
 * APPROVE REACTIVATION REQUEST
 * ==========================================
 */

export const approveReactivationRequestAction =
    createAsyncThunk<
        Awaited<
            ReturnType<
                typeof approveReactivationRequest
            >
        >,
        {
            requestId: number;
            adminNote?: string;
        },
        { rejectValue: string }
    >(
        "reactivationRequests/approveReactivationRequest",

        async (
            { requestId, adminNote },
            { rejectWithValue }
        ) => {
            try {
                return await approveReactivationRequest(
                    requestId,
                    adminNote
                );
            } catch (error) {
                return rejectWithValue(
                    error instanceof Error
                        ? error.message
                        : "Failed to approve reactivation request"
                );
            }
        }
    );
/*
* ==========================================
* REJECT REACTIVATION REQUEST
* ==========================================
*/

export const rejectReactivationRequestAction =
    createAsyncThunk<
        Awaited<
            ReturnType<
                typeof rejectReactivationRequest
            >
        >,
        {
            requestId: number;
            adminNote: string;
        },
        { rejectValue: string }
    >(
        "reactivationRequests/rejectReactivationRequest",

        async (
            { requestId, adminNote },
            { rejectWithValue }
        ) => {
            try {
                return await rejectReactivationRequest(
                    requestId,
                    adminNote
                );
            } catch (error) {
                return rejectWithValue(
                    error instanceof Error
                        ? error.message
                        : "Failed to reject reactivation request"
                );
            }
        }
    );
/*
 * ==========================================
 * SLICE
 * ==========================================
 */

const reactivationRequestsSlice =
    createSlice({
        name: "reactivationRequests",

        initialState,

        reducers: {
            clearReactivationRequestsError: (
                state
            ) => {
                state.error = null;
            },

            clearReactivationRequestDetailError: (
                state
            ) => {
                state.detailError = null;
            },

            clearReactivationActionError: (
                state
            ) => {
                state.actionError = null;
            },

            clearReactivationRequestDetail: (
                state
            ) => {
                state.detail = null;
                state.detailError = null;
            },
        },
        extraReducers: (
            builder
        ) => {
            /*
             * ==========================================
             * GET REACTIVATION REQUESTS
             * ==========================================
             */

            builder
                .addCase(
                    fetchReactivationRequests.pending,
                    (state) => {
                        state.loading = true;
                        state.error = null;
                    }
                )

                .addCase(
                    fetchReactivationRequests.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.loading = false;

                        if (
                            action.payload.success
                        ) {
                            state.requests =
                                action.payload.data;

                            state.pagination =
                                action.payload.pagination;
                        }
                    }
                )

                .addCase(
                    fetchReactivationRequests.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.loading = false;

                        state.error =
                            action.payload ||
                            "Failed to fetch reactivation requests";
                    }
                );
            /*
* ==========================================
* GET REACTIVATION REQUEST DETAIL
* ==========================================
*/

            builder
                .addCase(
                    fetchReactivationRequestDetail.pending,
                    (state) => {
                        state.detailLoading = true;
                        state.detailError = null;
                        state.detail = null;
                    }
                )

                .addCase(
                    fetchReactivationRequestDetail.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.detailLoading = false;

                        if (
                            action.payload.success
                        ) {
                            state.detail =
                                action.payload.data;
                        }
                    }
                )

                .addCase(
                    fetchReactivationRequestDetail.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.detailLoading = false;

                        state.detailError =
                            action.payload ||
                            "Failed to fetch reactivation request details";
                    }
                );
            /*
* ==========================================
* APPROVE REACTIVATION REQUEST
* ==========================================
*/

            builder
                .addCase(
                    approveReactivationRequestAction.pending,
                    (state) => {
                        state.actionLoading = true;
                        state.actionError = null;
                    }
                )

                .addCase(
                    approveReactivationRequestAction.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.actionLoading = false;

                        if (
                            state.detail &&
                            action.payload.success
                        ) {
                            state.detail.request.status =
                                action.payload.data.status;

                            state.detail.request.admin_note =
                                action.payload.data.admin_note;
                        }
                    }
                )

                .addCase(
                    approveReactivationRequestAction.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.actionLoading = false;

                        state.actionError =
                            action.payload ||
                            "Failed to approve reactivation request";
                    }
                );

            /*
             * ==========================================
             * REJECT REACTIVATION REQUEST
             * ==========================================
             */

            builder
                .addCase(
                    rejectReactivationRequestAction.pending,
                    (state) => {
                        state.actionLoading = true;
                        state.actionError = null;
                    }
                )

                .addCase(
                    rejectReactivationRequestAction.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.actionLoading = false;

                        if (
                            state.detail &&
                            action.payload.success
                        ) {
                            state.detail.request.status =
                                action.payload.data.status;

                            state.detail.request.admin_note =
                                action.payload.data.admin_note;
                        }
                    }
                )

                .addCase(
                    rejectReactivationRequestAction.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.actionLoading = false;

                        state.actionError =
                            action.payload ||
                            "Failed to reject reactivation request";
                    }
                );
        },
    });

export const {
    clearReactivationRequestsError,
    clearReactivationRequestDetailError,
    clearReactivationActionError,
    clearReactivationRequestDetail,
} = reactivationRequestsSlice.actions;

export default reactivationRequestsSlice.reducer;