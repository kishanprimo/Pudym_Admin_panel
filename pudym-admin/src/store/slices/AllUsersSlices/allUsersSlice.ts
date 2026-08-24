import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getAllUsers } from "@/store/api/AllUsersApi/getAllUsers.api";
import { getUserStats } from "@/store/api/AllUsersApi/getUserStats.api";
import { getUserDetails } from "@/store/api/AllUsersApi/getUserDetails.api";
import { deleteUser } from "@/store/api/AllUsersApi/deleteUser.api";
import { updateUserStatus } from "@/store/api/AllUsersApi/updateUserStatus.api";

import type {
    UserListItem,
    UsersPagination,
} from "@/types/AllUsersTypes/getAllUsers.types";

import type {
    UserStats,
} from "@/types/AllUsersTypes/getUserStats.types";

import type {
    UserDetails,
} from "@/types/AllUsersTypes/getUserDetails.types";
import { updateUserBlockStatus } from "@/store/api/AllUsersApi/updateUserBlockStatus.api";

interface AllUsersState {
    users: UserListItem[];
    pagination: UsersPagination;

    stats: UserStats;

    selectedUser: UserDetails | null;

    loading: boolean;
    statsLoading: boolean;
    detailsLoading: boolean;
    statusLoading: boolean;
    deleteLoading: boolean;
    statusLoadingUserId: number | null;
    deleteLoadingUserId: number | null;
    blockLoading: boolean;
    blockLoadingUserId: number | null;
    error: string | null;
    statsError: string | null;
    detailsError: string | null;
}

const initialState: AllUsersState = {
    users: [],

    pagination: {
        total_pages: 0,
        total_records: 0,
        current_page: 1,
        records_per_page: 10,
    },

    stats: {
        total_users: 0,
        active_users: 0,
        deactivated_users: 0,
        blocked_users: 0,
    },

    selectedUser: null,

    loading: false,
    statsLoading: false,
    detailsLoading: false,
    statusLoading: false,
    deleteLoading: false,
    blockLoading: false,
    statusLoadingUserId: null,
    deleteLoadingUserId: null,
    blockLoadingUserId: null,
    error: null,
    statsError: null,
    detailsError: null,
};

/**
 * Get All Users
 */
export const fetchAllUsers = createAsyncThunk<
    Awaited<ReturnType<typeof getAllUsers>>,
    {
        page?: number;
        pageSize?: number;
        search?: string;
    },
    { rejectValue: string }
>(
    "allUsers/fetchAllUsers",
    async (params, { rejectWithValue }) => {
        try {
            return await getAllUsers(params);
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch users"
            );
        }
    }
);

/**
 * Get User Statistics
 */
export const fetchUserStats = createAsyncThunk<
    Awaited<ReturnType<typeof getUserStats>>,
    void,
    { rejectValue: string }
>(
    "allUsers/fetchUserStats",
    async (_, { rejectWithValue }) => {
        try {
            return await getUserStats();
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch user statistics"
            );
        }
    }
);

/**
 * Get Single User Details
 */
export const fetchUserDetails = createAsyncThunk<
    Awaited<ReturnType<typeof getUserDetails>>,
    number,
    { rejectValue: string }
>(
    "allUsers/fetchUserDetails",
    async (userId, { rejectWithValue }) => {
        try {
            return await getUserDetails(userId);
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch user details"
            );
        }
    }
);

/**
 * Activate / Deactivate User
 */
export const changeUserStatus = createAsyncThunk<
    Awaited<ReturnType<typeof updateUserStatus>>,
    {
        userId: number;
        is_deactivated: boolean;
    },
    { rejectValue: string }
>(
    "allUsers/changeUserStatus",
    async (
        { userId, is_deactivated },
        { rejectWithValue }
    ) => {
        try {
            return await updateUserStatus(
                userId,
                is_deactivated
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


/**
 * Block / Unblock User
 */
export const changeUserBlockStatus = createAsyncThunk<
    Awaited<ReturnType<typeof updateUserBlockStatus>>,
    {
        userId: number;
        blocked_by_admin: boolean;
    },
    { rejectValue: string }
>(
    "allUsers/changeUserBlockStatus",
    async (
        { userId, blocked_by_admin },
        { rejectWithValue }
    ) => {
        try {
            return await updateUserBlockStatus(
                userId,
                blocked_by_admin
            );
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to update user block status"
            );
        }
    }
);
/**
 * Delete User
 */
export const removeUser = createAsyncThunk<
    Awaited<ReturnType<typeof deleteUser>>,
    number,
    { rejectValue: string }
>(
    "allUsers/removeUser",
    async (userId, { rejectWithValue }) => {
        try {
            return await deleteUser(userId);
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to delete user"
            );
        }
    }
);

const allUsersSlice = createSlice({
    name: "allUsers",

    initialState,

    reducers: {
        clearSelectedUser: (state) => {
            state.selectedUser = null;
            state.detailsError = null;
        },

        clearAllUsersError: (state) => {
            state.error = null;
        },

        clearStatsError: (state) => {
            state.statsError = null;
        },

        clearDetailsError: (state) => {
            state.detailsError = null;
        },
    },

    extraReducers: (builder) => {
        /*
         * ==========================================
         * GET ALL USERS
         * ==========================================
         */

        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.success) {
                    state.users = action.payload.data.Records;

                    state.pagination =
                        action.payload.data.Pagination;
                }
            })

            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;

                state.error =
                    action.payload || "Failed to fetch users";
            });

        /*
         * ==========================================
         * GET USER STATS
         * ==========================================
         */

        builder
            .addCase(fetchUserStats.pending, (state) => {
                state.statsLoading = true;
                state.statsError = null;
            })

            .addCase(fetchUserStats.fulfilled, (state, action) => {
                state.statsLoading = false;

                if (action.payload.success) {
                    state.stats = action.payload.data;
                }
            })

            .addCase(fetchUserStats.rejected, (state, action) => {
                state.statsLoading = false;

                state.statsError =
                    action.payload ||
                    "Failed to fetch user statistics";
            });

        /*
         * ==========================================
         * GET USER DETAILS
         * ==========================================
         */

        builder
            .addCase(fetchUserDetails.pending, (state) => {
                state.detailsLoading = true;
                state.detailsError = null;
                state.selectedUser = null;
            })

            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.detailsLoading = false;

                if (action.payload.success) {
                    state.selectedUser =
                        action.payload.data;
                }
            })

            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.detailsLoading = false;

                state.detailsError =
                    action.payload ||
                    "Failed to fetch user details";
            });

        /*
         * ==========================================
         * ACTIVATE / DEACTIVATE USER
         * ==========================================
         */

        builder
            .addCase(changeUserStatus.pending, (state, action) => {
                state.statusLoading = true;
                state.statusLoadingUserId = action.meta.arg.userId;
                state.error = null;
            })

            .addCase(changeUserStatus.fulfilled, (state, action) => {
                state.statusLoading = false;
                state.statusLoadingUserId = null;

                if (!action.payload.success) {
                    return;
                }

                const updatedUser =
                    action.payload.data;

                /*
                 * Update the user directly in the
                 * currently loaded table.
                 */
                const user = state.users.find(
                    (item) =>
                        item.user_id === updatedUser.user_id
                );

                if (user) {
                    user.is_deactivated =
                        updatedUser.is_deactivated;

                    user.blocked_by_admin =
                        updatedUser.blocked_by_admin;
                }

                /*
                 * Also update selected user if the
                 * same user is currently open.
                 */
                if (
                    state.selectedUser?.user_id ===
                    updatedUser.user_id
                ) {
                    state.selectedUser.is_deactivated =
                        updatedUser.is_deactivated;

                    state.selectedUser.blocked_by_admin =
                        updatedUser.blocked_by_admin;
                }
            })

            .addCase(changeUserStatus.rejected, (state, action) => {
                state.statusLoading = false;
                state.statusLoadingUserId = null;

                state.error =
                    action.payload ||
                    "Failed to update user status";
            });
        /*
* ==========================================
* BLOCK / UNBLOCK USER
* ==========================================
*/

        builder
            .addCase(changeUserBlockStatus.pending, (state, action) => {
                state.blockLoading = true;
                state.blockLoadingUserId = action.meta.arg.userId;
                state.error = null;
            })

            .addCase(changeUserBlockStatus.fulfilled, (state, action) => {
                state.blockLoading = false;
                state.blockLoadingUserId = null;

                if (!action.payload.success) {
                    return;
                }

                const updatedUser = action.payload.data;

                /*
                 * Update user in the All Users list
                 */
                const user = state.users.find(
                    (item) =>
                        item.user_id === updatedUser.user_id
                );

                if (user) {
                    user.blocked_by_admin =
                        updatedUser.blocked_by_admin;

                    user.is_deactivated =
                        updatedUser.is_deactivated;
                }

                /*
                 * Update currently opened User View
                 */
                if (
                    state.selectedUser?.user_id ===
                    updatedUser.user_id
                ) {
                    state.selectedUser.blocked_by_admin =
                        updatedUser.blocked_by_admin;

                    state.selectedUser.is_deactivated =
                        updatedUser.is_deactivated;
                }
            })

            .addCase(changeUserBlockStatus.rejected, (state, action) => {
                state.blockLoading = false;
                state.blockLoadingUserId = null;

                state.error =
                    action.payload ||
                    "Failed to update user block status";
            });
        /*
         * ==========================================
         * DELETE USER
         * ==========================================
         */

        builder
            .addCase(removeUser.pending, (state, action) => {
                state.deleteLoading = true;
                state.deleteLoadingUserId = action.meta.arg;
                state.error = null;
            })

            .addCase(removeUser.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.deleteLoadingUserId = null;

                if (!action.payload.success) {
                    return;
                }

                const deletedUserId =
                    action.payload.data.user_id;

                /*
                 * Remove the user immediately from
                 * the current table.
                 */
                state.users = state.users.filter(
                    (user) =>
                        user.user_id !== deletedUserId
                );

                /*
                 * If this user was currently open,
                 * clear the selected user.
                 */
                if (
                    state.selectedUser?.user_id ===
                    deletedUserId
                ) {
                    state.selectedUser = null;
                }
            })

            .addCase(removeUser.rejected, (state, action) => {
                state.deleteLoading = false;
                state.deleteLoadingUserId = null;

                state.error =
                    action.payload ||
                    "Failed to delete user";
            });
    },
});

export const {
    clearSelectedUser,
    clearAllUsersError,
    clearStatsError,
    clearDetailsError,
} = allUsersSlice.actions;

export default allUsersSlice.reducer;