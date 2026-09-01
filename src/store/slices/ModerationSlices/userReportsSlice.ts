import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getUserReports,
} from "@/store/api/ModerationApi/getUserReports.api";

import {
    getUserReportDetails,
} from "@/store/api/ModerationApi/getUserReportDetails.api";

import {
    getUserReportStats,
} from "@/store/api/ModerationApi/getUserReportStats.api";

import {
    updateUserStatus,
} from "@/store/api/ModerationApi/updateUserStatus.api";

import {
    deleteUserReport,
} from "@/store/api/ModerationApi/deleteUserReport.api";

import type {
    UserReport,
    UserReportStats,
    UserReportsPagination,
} from "@/types/ModerationTypes/userReports.types";


interface UserReportsState {
    reports: UserReport[];

    selectedReport: UserReport | null;

    pagination: UserReportsPagination;

    stats: UserReportStats;

    loading: boolean;
    statsLoading: boolean;
    detailsLoading: boolean;

    statusLoading: boolean;
    statusLoadingUserId: number | null;

    deleteReportLoading: boolean;
    deleteReportLoadingId: number | null;

    error: string | null;
    statsError: string | null;
    detailsError: string | null;
}


const initialState: UserReportsState = {
    reports: [],

    selectedReport: null,

    pagination: {
        total_pages: 0,
        total_records: 0,
        current_page: 1,
        records_per_page: 10,
    },

    stats: {
        total_reports: 0,
        active_users: 0,
        deactivated_users: 0,
    },

    loading: false,
    statsLoading: false,
    detailsLoading: false,

    statusLoading: false,
    statusLoadingUserId: null,

    deleteReportLoading: false,
    deleteReportLoadingId: null,

    error: null,
    statsError: null,
    detailsError: null,
};


/*
 * ==========================================
 * GET USER REPORTS
 * ==========================================
 */

export const fetchUserReports =
    createAsyncThunk<
        Awaited<
            ReturnType<typeof getUserReports>
        >,
        {
            page?: number;
            pageSize?: number;
            search?: string;
            status?: string;
        },
        { rejectValue: string }
    >(
        "userReports/fetchUserReports",

        async (
            params,
            { rejectWithValue }
        ) => {
            try {
                return await getUserReports(
                    params
                );
            } catch (error) {
                return rejectWithValue(
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch user reports"
                );
            }
        }
    );


/*
 * ==========================================
 * GET USER REPORT STATS
 * ==========================================
 */

export const fetchUserReportStats =
    createAsyncThunk<
        Awaited<
            ReturnType<typeof getUserReportStats>
        >,
        void,
        { rejectValue: string }
    >(
        "userReports/fetchUserReportStats",

        async (
            _,
            { rejectWithValue }
        ) => {
            try {
                return await getUserReportStats();
            } catch (error) {
                return rejectWithValue(
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch user report statistics"
                );
            }
        }
    );


/*
 * ==========================================
 * GET USER REPORT DETAILS
 * ==========================================
 */

export const fetchUserReportDetails =
    createAsyncThunk<
        Awaited<
            ReturnType<typeof getUserReportDetails>
        >,
        number,
        { rejectValue: string }
    >(
        "userReports/fetchUserReportDetails",

        async (
            reportId,
            { rejectWithValue }
        ) => {
            try {
                return await getUserReportDetails(
                    reportId
                );
            } catch (error) {
                return rejectWithValue(
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch user report details"
                );
            }
        }
    );


/*
 * ==========================================
 * ACTIVATE / DEACTIVATE USER
 * ==========================================
 */

export const changeUserStatus =
    createAsyncThunk<
        Awaited<
            ReturnType<typeof updateUserStatus>
        >,
        {
            userId: number;
            isDeactivated: boolean;
        },
        { rejectValue: string }
    >(
        "userReports/changeUserStatus",

        async (
            {
                userId,
                isDeactivated,
            },
            { rejectWithValue }
        ) => {
            try {
                return await updateUserStatus(
                    userId,
                    isDeactivated
                );
            } catch (error) {
                return rejectWithValue(
                    error instanceof Error
                        ? error.message
                        : "Failed to update user status"
                );
            }
        }
    );


/*
 * ==========================================
 * DELETE USER REPORT
 * ==========================================
 */

export const removeUserReport =
    createAsyncThunk<
        Awaited<
            ReturnType<typeof deleteUserReport>
        >,
        number,
        { rejectValue: string }
    >(
        "userReports/removeUserReport",

        async (
            reportId,
            { rejectWithValue }
        ) => {
            try {
                return await deleteUserReport(
                    reportId
                );
            } catch (error) {
                return rejectWithValue(
                    error instanceof Error
                        ? error.message
                        : "Failed to delete user report"
                );
            }
        }
    );


/*
 * ==========================================
 * SLICE
 * ==========================================
 */

const userReportsSlice =
    createSlice({
        name: "userReports",

        initialState,

        reducers: {

            clearUserReportsError: (
                state
            ) => {
                state.error = null;
            },

            clearUserReportStatsError: (
                state
            ) => {
                state.statsError = null;
            },

            clearSelectedUserReport: (
                state
            ) => {
                state.selectedReport = null;
                state.detailsError = null;
            },
        },

        extraReducers: (
            builder
        ) => {

            /*
             * ==========================================
             * USER REPORTS
             * ==========================================
             */

            builder
                .addCase(
                    fetchUserReports.pending,
                    (state) => {
                        state.loading = true;
                        state.error = null;
                    }
                )

                .addCase(
                    fetchUserReports.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.loading = false;

                        if (
                            action.payload.success
                        ) {
                            state.reports =
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
                    fetchUserReports.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.loading = false;

                        state.error =
                            action.payload ||
                            "Failed to fetch user reports";
                    }
                );


            /*
             * ==========================================
             * USER REPORT STATS
             * ==========================================
             */

            builder
                .addCase(
                    fetchUserReportStats.pending,
                    (state) => {
                        state.statsLoading = true;
                        state.statsError = null;
                    }
                )

                .addCase(
                    fetchUserReportStats.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.statsLoading = false;

                        if (
                            action.payload.success
                        ) {
                            state.stats =
                                action.payload
                                    .data;
                        }
                    }
                )

                .addCase(
                    fetchUserReportStats.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.statsLoading = false;

                        state.statsError =
                            action.payload ||
                            "Failed to fetch user report statistics";
                    }
                );


            /*
             * ==========================================
             * USER REPORT DETAILS
             * ==========================================
             */

            builder
                .addCase(
                    fetchUserReportDetails.pending,
                    (state) => {
                        state.detailsLoading = true;
                        state.detailsError = null;
                        state.selectedReport = null;
                    }
                )

                .addCase(
                    fetchUserReportDetails.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.detailsLoading = false;

                        if (
                            action.payload.success
                        ) {
                            state.selectedReport =
                                action.payload.data;
                        }
                    }
                )

                .addCase(
                    fetchUserReportDetails.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.detailsLoading = false;

                        state.detailsError =
                            action.payload ||
                            "Failed to fetch user report details";
                    }
                );


            /*
             * ==========================================
             * ACTIVATE / DEACTIVATE USER
             * ==========================================
             */

            builder
                .addCase(
                    changeUserStatus.pending,
                    (
                        state,
                        action
                    ) => {
                        state.statusLoading = true;

                        state.statusLoadingUserId =
                            action.meta.arg.userId;

                        state.error = null;
                    }
                )

                .addCase(
                    changeUserStatus.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.statusLoading = false;

                        state.statusLoadingUserId = null;

                        if (
                            !action.payload.success
                        ) {
                            return;
                        }

                        const updatedUser =
                            action.payload.data;

                        /*
                         * Update every report where
                         * this user is the reported user.
                         */

                        state.reports.forEach(
                            (report) => {

                                if (
                                    report.reported?.user_id ===
                                    updatedUser.user_id
                                ) {
                                    report.reported.is_deactivated =
                                        updatedUser.is_deactivated;
                                }

                                /*
                                 * Also update reporter if
                                 * the same user happens to
                                 * be the reporter.
                                 */

                                if (
                                    report.reporter?.user_id ===
                                    updatedUser.user_id
                                ) {
                                    report.reporter.is_deactivated =
                                        updatedUser.is_deactivated;
                                }
                            }
                        );


                        /*
                         * Update currently opened report.
                         */

                        if (
                            state.selectedReport
                        ) {

                            if (
                                state.selectedReport
                                    .reported
                                    ?.user_id ===
                                updatedUser.user_id
                            ) {
                                state.selectedReport
                                    .reported
                                    .is_deactivated =
                                    updatedUser.is_deactivated;
                            }

                            if (
                                state.selectedReport
                                    .reporter
                                    ?.user_id ===
                                updatedUser.user_id
                            ) {
                                state.selectedReport
                                    .reporter
                                    .is_deactivated =
                                    updatedUser.is_deactivated;
                            }
                        }
                    }
                )

                .addCase(
                    changeUserStatus.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.statusLoading = false;

                        state.statusLoadingUserId = null;

                        state.error =
                            action.payload ||
                            "Failed to update user status";
                    }
                );


            /*
             * ==========================================
             * DELETE USER REPORT
             * ==========================================
             */

            builder
                .addCase(
                    removeUserReport.pending,
                    (
                        state,
                        action
                    ) => {
                        state.deleteReportLoading = true;

                        state.deleteReportLoadingId =
                            action.meta.arg;

                        state.error = null;
                    }
                )

                .addCase(
                    removeUserReport.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.deleteReportLoading = false;

                        state.deleteReportLoadingId = null;

                        if (
                            !action.payload.success
                        ) {
                            return;
                        }

                        const deletedReportId =
                            action.meta.arg;

                        state.reports =
                            state.reports.filter(
                                (report) =>
                                    report.report_id !==
                                    deletedReportId
                            );

                        if (
                            state.selectedReport
                                ?.report_id ===
                            deletedReportId
                        ) {
                            state.selectedReport = null;
                        }

                        if (
                            state.pagination
                                .total_records >
                            0
                        ) {
                            state.pagination
                                .total_records -= 1;
                        }
                    }
                )

                .addCase(
                    removeUserReport.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.deleteReportLoading = false;

                        state.deleteReportLoadingId = null;

                        state.error =
                            action.payload ||
                            "Failed to delete user report";
                    }
                );
        },
    });


export const {
    clearUserReportsError,
    clearUserReportStatsError,
    clearSelectedUserReport,
} = userReportsSlice.actions;


export default userReportsSlice.reducer;