import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getContentReports,
} from "@/store/api/ModerationApi/getContentReports.api";

import {
    getContentReportStats,
} from "@/store/api/ModerationApi/getContentReportStats.api";

import type {
    ContentReport,
    ContentReportStats,
    ContentReportsPagination,
} from "@/types/ModerationTypes/contentReports.types";
import {
    getContentReportDetails,
} from "@/store/api/ModerationApi/getContentReportDetails.api";
import {
    updateContentStatus,
} from "@/store/api/ModerationApi/updateContentStatus.api";

import {
    deleteContent,
} from "@/store/api/ModerationApi/deleteContent.api";

import {
    deleteContentReport,
} from "@/store/api/ModerationApi/deleteContentReport.api";

interface ContentReportsState {
    reports: ContentReport[];

    selectedReport: ContentReport | null;

    pagination: ContentReportsPagination;

    stats: ContentReportStats;

    loading: boolean;
    statsLoading: boolean;
    detailsLoading: boolean;

    statusLoading: boolean;
    statusLoadingSocialId: number | null;

    deleteReportLoading: boolean;
    deleteReportLoadingId: number | null;

    removeContentLoading: boolean;

    error: string | null;
    statsError: string | null;
    detailsError: string | null;
}
const initialState: ContentReportsState = {
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
        active_content: 0,
        hidden_content: 0,
        removed_content: 0,
    },

    loading: false,
    statsLoading: false,
    detailsLoading: false,

    statusLoading: false,
    statusLoadingSocialId: null,

    deleteReportLoading: false,
    deleteReportLoadingId: null,

    removeContentLoading: false,

    error: null,
    statsError: null,
    detailsError: null,
};

/*
 * ==========================================
 * GET CONTENT REPORTS
 * ==========================================
 */

export const fetchContentReports =
    createAsyncThunk<
        Awaited<
            ReturnType<typeof getContentReports>
        >,
        {
            page?: number;
            pageSize?: number;
            search?: string;
            status?: string;
            social_type?: "post" | "reel" | "";
        },
        { rejectValue: string }
    >(
        "contentReports/fetchContentReports",

        async (
            params,
            { rejectWithValue }
        ) => {
            try {
                return await getContentReports(
                    params
                );
            } catch (error) {
                return rejectWithValue(
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch content reports"
                );
            }
        }
    );

/*
 * ==========================================
 * GET CONTENT REPORT STATS
 * ==========================================
 */

export const fetchContentReportStats =
    createAsyncThunk<
        Awaited<
            ReturnType<typeof getContentReportStats>
        >,
        void,
        { rejectValue: string }
    >(
        "contentReports/fetchContentReportStats",

        async (
            _,
            { rejectWithValue }
        ) => {
            try {
                return await getContentReportStats();
            } catch (error) {
                return rejectWithValue(
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch content report statistics"
                );
            }
        }
    );

/*
* ==========================================
* GET CONTENT REPORT DETAILS
* ==========================================
*/

export const fetchContentReportDetails =
    createAsyncThunk<
        Awaited<
            ReturnType<typeof getContentReportDetails>
        >,
        number,
        { rejectValue: string }
    >(
        "contentReports/fetchContentReportDetails",

        async (
            reportId,
            { rejectWithValue }
        ) => {

            try {

                return await getContentReportDetails(
                    reportId
                );

            } catch (error) {

                return rejectWithValue(
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch content report details"
                );
            }
        }
    );

/*
 * ==========================================
 * HIDE / ACTIVATE CONTENT
 * ==========================================
 */

export const changeContentStatus =
    createAsyncThunk<
        Awaited<
            ReturnType<typeof updateContentStatus>
        >,
        {
            socialId: number;
            status: boolean;
        },
        { rejectValue: string }
    >(
        "contentReports/changeContentStatus",

        async (
            {
                socialId,
                status,
            },
            { rejectWithValue }
        ) => {

            try {

                return await updateContentStatus(
                    socialId,
                    status
                );

            } catch (error) {

                return rejectWithValue(
                    error instanceof Error
                        ? error.message
                        : "Failed to update content status"
                );
            }
        }
    );
/*
* ==========================================
* DELETE CONTENT REPORT
* ==========================================
*/

export const removeContentReport =
    createAsyncThunk<
        Awaited<
            ReturnType<typeof deleteContentReport>
        >,
        number,
        { rejectValue: string }
    >(
        "contentReports/removeContentReport",

        async (
            reportId,
            { rejectWithValue }
        ) => {

            try {

                return await deleteContentReport(
                    reportId
                );

            } catch (error) {

                return rejectWithValue(
                    error instanceof Error
                        ? error.message
                        : "Failed to delete content report"
                );
            }
        }
    );
/*
* ==========================================
* REMOVE CONTENT
* ==========================================
*/

export const removeReportedContent =
    createAsyncThunk<
        Awaited<
            ReturnType<typeof deleteContent>
        >,
        number,
        { rejectValue: string }
    >(
        "contentReports/removeReportedContent",

        async (
            socialId,
            { rejectWithValue }
        ) => {

            try {

                return await deleteContent(
                    socialId
                );

            } catch (error) {

                return rejectWithValue(
                    error instanceof Error
                        ? error.message
                        : "Failed to remove content"
                );
            }
        }
    );
/*
 * ==========================================
 * SLICE
 * ==========================================
 */

const contentReportsSlice =
    createSlice({
        name: "contentReports",

        initialState,

        reducers: {

            clearContentReportsError: (
                state
            ) => {
                state.error = null;
            },

            clearContentReportStatsError: (
                state
            ) => {
                state.statsError = null;
            },

            clearSelectedContentReport: (
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
             * CONTENT REPORTS
             * ==========================================
             */

            builder
                .addCase(
                    fetchContentReports.pending,
                    (state) => {
                        state.loading = true;
                        state.error = null;
                    }
                )

                .addCase(
                    fetchContentReports.fulfilled,
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
                    fetchContentReports.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.loading = false;

                        state.error =
                            action.payload ||
                            "Failed to fetch content reports";
                    }
                );

            /*
             * ==========================================
             * CONTENT REPORT STATS
             * ==========================================
             */

            builder
                .addCase(
                    fetchContentReportStats.pending,
                    (state) => {
                        state.statsLoading =
                            true;

                        state.statsError =
                            null;
                    }
                )

                .addCase(
                    fetchContentReportStats.fulfilled,
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
                                action.payload
                                    .data;
                        }
                    }
                )

                .addCase(
                    fetchContentReportStats.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.statsLoading =
                            false;

                        state.statsError =
                            action.payload ||
                            "Failed to fetch content report statistics";
                    }
                );
            /*
* ==========================================
* CONTENT REPORT DETAILS
* ==========================================
*/

            builder
                .addCase(
                    fetchContentReportDetails.pending,
                    (state) => {

                        state.detailsLoading = true;
                        state.detailsError = null;
                        state.selectedReport = null;
                    }
                )

                .addCase(
                    fetchContentReportDetails.fulfilled,
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
                    fetchContentReportDetails.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.detailsLoading = false;

                        state.detailsError =
                            action.payload ||
                            "Failed to fetch content report details";
                    }
                );
            /*
* ==========================================
* HIDE / ACTIVATE CONTENT
* ==========================================
*/

            builder
                .addCase(
                    changeContentStatus.pending,
                    (
                        state,
                        action
                    ) => {

                        state.statusLoading = true;

                        state.statusLoadingSocialId =
                            action.meta.arg.socialId;

                        state.error = null;
                    }
                )

                .addCase(
                    changeContentStatus.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.statusLoading = false;

                        state.statusLoadingSocialId = null;

                        if (
                            !action.payload.success
                        ) {
                            return;
                        }

                        const updatedContent =
                            action.payload.data;

                        /*
                         * Update content inside
                         * the current report list.
                         */

                        const report =
                            state.reports.find(
                                (item) =>
                                    item.social_id ===
                                    updatedContent.social_id
                            );

                        if (report?.Social) {

                            report.Social.status =
                                updatedContent.status;
                        }

                        /*
                         * Update currently opened
                         * report view.
                         */

                        if (
                            state.selectedReport?.social_id ===
                            updatedContent.social_id &&
                            state.selectedReport.Social
                        ) {

                            state.selectedReport.Social.status =
                                updatedContent.status;
                        }
                    }
                )

                .addCase(
                    changeContentStatus.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.statusLoading = false;

                        state.statusLoadingSocialId = null;

                        state.error =
                            action.payload ||
                            "Failed to update content status";
                    }
                );
            /*
* ==========================================
* DELETE CONTENT REPORT
* ==========================================
*/

            builder
                .addCase(
                    removeContentReport.pending,
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
                    removeContentReport.fulfilled,
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

                        /*
                         * We need the deleted report ID.
                         *
                         * Since the DELETE response structure
                         * has not been provided yet, use the
                         * thunk argument.
                         */

                        const deletedReportId =
                            action.meta.arg;

                        state.reports =
                            state.reports.filter(
                                (report) =>
                                    report.report_id !==
                                    deletedReportId
                            );

                        /*
                         * If the deleted report was
                         * currently selected, clear it.
                         */

                        if (
                            state.selectedReport?.report_id ===
                            deletedReportId
                        ) {

                            state.selectedReport = null;
                        }

                        /*
                         * Keep pagination count
                         * consistent with the UI.
                         */

                        if (
                            state.pagination.total_records >
                            0
                        ) {

                            state.pagination.total_records -= 1;
                        }
                    }
                )

                .addCase(
                    removeContentReport.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.deleteReportLoading = false;

                        state.deleteReportLoadingId = null;

                        state.error =
                            action.payload ||
                            "Failed to delete content report";
                    }
                );
            /*
* ==========================================
* REMOVE CONTENT
* ==========================================
*/

            builder
                .addCase(
                    removeReportedContent.pending,
                    (
                        state
                    ) => {

                        state.removeContentLoading = true;

                        state.error = null;
                    }
                )

                .addCase(
                    removeReportedContent.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.removeContentLoading = false;

                        if (
                            !action.payload.success
                        ) {
                            return;
                        }

                        const removedSocialId =
                            action.meta.arg;

                        /*
                         * ==========================================
                         * UPDATE CONTENT IN REPORT LIST
                         * ==========================================
                         */

                        state.reports.forEach(
                            (report) => {

                                if (
                                    report.social_id ===
                                    removedSocialId &&
                                    report.Social
                                ) {

                                    report.Social.status = false;

                                    report.Social.removed_by_admin = true;
                                }
                            }
                        );

                        /*
                         * ==========================================
                         * UPDATE CURRENTLY OPENED REPORT
                         * ==========================================
                         */

                        if (
                            state.selectedReport?.social_id ===
                            removedSocialId &&
                            state.selectedReport.Social
                        ) {

                            state.selectedReport.Social.status = false;

                            state.selectedReport.Social.removed_by_admin = true;
                        }
                    }
                )

                .addCase(
                    removeReportedContent.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.removeContentLoading = false;

                        state.error =
                            action.payload ||
                            "Failed to remove content";
                    }
                );
        },
    });

export const {
    clearContentReportsError,
    clearContentReportStatsError,
    clearSelectedContentReport,
} = contentReportsSlice.actions;

export default contentReportsSlice.reducer;