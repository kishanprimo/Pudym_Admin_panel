import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
} from "@reduxjs/toolkit";
import { getNotifications } from "@/store/api/NotificationApi/getNotifications.api";
import { getNotification } from "@/store/api/NotificationApi/getNotification.api";
import { updateNotification } from "@/store/api/NotificationApi/updateNotification.api";
import { getAudience } from "@/store/api/NotificationApi/getAudience.api";
import { sendEmail } from "@/store/api/NotificationApi/sendEmail.api";
import { sendPush } from "@/store/api/NotificationApi/sendPush.api";
import type {
    CommunicationNotification,
    NotificationAudience,
    AudienceUser,
    SendEmailPayload,
    SendPushPayload,
    UpdateNotificationPayload,
} from "@/types/NotificationTypes/notification.types";
import { getNotificationStats } from "@/store/api/NotificationApi/getNotificationStats.api";

interface NotificationState {
    notifications: CommunicationNotification[];
    selectedNotification: CommunicationNotification | null;
    selectedNotificationLoading: boolean;
    selectedNotificationError: string | null;

    notificationUpdating: boolean;
    notificationUpdateError: string | null;
    notificationUpdateResponse: Awaited<
        ReturnType<typeof updateNotification>
    > | null;

    loading: boolean;
    error: string | null;

    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;

    stats: {
        total_notifications: number;
        all_users: number;
        creators: number;
        subscribers: number;
    };

    statsLoading: boolean;
    statsError: string | null;

    audienceUsers: AudienceUser[];
    audienceCount: number;
    audienceLoading: boolean;
    audienceError: string | null;

    emailSending: boolean;
    emailError: string | null;
    emailResponse: Awaited<ReturnType<typeof sendEmail>> | null;

    pushSending: boolean;
    pushError: string | null;
    pushResponse: Awaited<ReturnType<typeof sendPush>> | null;
}

const initialState: NotificationState = {
    notifications: [],
    selectedNotification: null,
    selectedNotificationLoading: false,
    selectedNotificationError: null,

    notificationUpdating: false,
    notificationUpdateError: null,
    notificationUpdateResponse: null,
    loading: false,
    error: null,

    currentPage: 1,
    pageSize: 5,
    totalPages: 0,
    totalRecords: 0,

    stats: {
        total_notifications: 0,
        all_users: 0,
        creators: 0,
        subscribers: 0,
    },

    statsLoading: false,
    statsError: null,
    audienceUsers: [],
    audienceCount: 0,
    audienceLoading: false,
    audienceError: null,

    emailSending: false,
    emailError: null,
    emailResponse: null,

    pushSending: false,
    pushError: null,
    pushResponse: null,
};

export const fetchNotifications = createAsyncThunk<
    Awaited<ReturnType<typeof getNotifications>>,
    {
        page?: number;
        pageSize?: number;
        channel?: "email" | "push";
        audience?: "all_users" | "creators" | "subscribers";
        search?: string;
    },
    { rejectValue: string }
>(
    "notification/fetchNotifications",
    async (params, { rejectWithValue }) => {
        try {
            return await getNotifications(params);
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to fetch notifications"
            );
        }
    }
);
export const fetchNotificationById =
    createAsyncThunk<
        Awaited<ReturnType<typeof getNotification>>,
        number,
        { rejectValue: string }
    >(
        "notification/fetchNotificationById",
        async (
            communicationId,
            { rejectWithValue }
        ) => {
            try {
                return await getNotification(
                    communicationId
                );
            } catch (error: any) {
                return rejectWithValue(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to fetch notification"
                );
            }
        }
    );
export const updateNotificationThunk =
    createAsyncThunk<
        Awaited<ReturnType<typeof updateNotification>>,
        {
            communicationId: number;
            payload: UpdateNotificationPayload;
        },
        { rejectValue: string }
    >(
        "notification/updateNotification",
        async (
            {
                communicationId,
                payload,
            },
            { rejectWithValue }
        ) => {
            try {
                return await updateNotification(
                    communicationId,
                    payload
                );
            } catch (error: any) {
                return rejectWithValue(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to update notification"
                );
            }
        }
    );
export const fetchNotificationStats =
    createAsyncThunk<
        Awaited<ReturnType<typeof getNotificationStats>>,
        void,
        { rejectValue: string }
    >(
        "notification/fetchNotificationStats",
        async (_, { rejectWithValue }) => {
            try {
                return await getNotificationStats();
            } catch (error: any) {
                return rejectWithValue(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to fetch notification stats"
                );
            }
        }
    );

export const fetchAudience = createAsyncThunk<
    Awaited<ReturnType<typeof getAudience>>,
    NotificationAudience,
    { rejectValue: string }
>(
    "notification/fetchAudience",
    async (audience, { rejectWithValue }) => {
        try {
            return await getAudience(audience);
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to fetch audience"
            );
        }
    }
);
export const sendEmailThunk = createAsyncThunk<
    Awaited<ReturnType<typeof sendEmail>>,
    SendEmailPayload,
    { rejectValue: string }
>(
    "notification/sendEmail",
    async (payload, { rejectWithValue }) => {
        try {
            return await sendEmail(payload);
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to send email"
            );
        }
    }
);
export const sendPushThunk = createAsyncThunk<
    Awaited<ReturnType<typeof sendPush>>,
    SendPushPayload,
    { rejectValue: string }
>(
    "notification/sendPush",
    async (payload, { rejectWithValue }) => {
        try {
            return await sendPush(payload);
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to send push notification"
            );
        }
    }
);
const notificationSlice = createSlice({
    name: "notification",

    initialState,

    reducers: {
        clearNotificationError: (state) => {
            state.error = null;
        },

        setSelectedNotification: (
            state,
            action: PayloadAction<CommunicationNotification>
        ) => {
            state.selectedNotification = action.payload;
        },

        clearSelectedNotification: (state) => {
            state.selectedNotification = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.success) {
                    state.notifications =
                        action.payload.data.Records;

                    state.currentPage =
                        action.payload.data.Pagination.current_page;

                    state.pageSize =
                        action.payload.data.Pagination.records_per_page;

                    state.totalPages =
                        action.payload.data.Pagination.total_pages;

                    state.totalRecords =
                        action.payload.data.Pagination.total_records;
                }
            })

            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload ||
                    "Failed to fetch notifications";
            });
        builder
            .addCase(
                fetchNotificationStats.pending,
                (state) => {
                    state.statsLoading = true;
                    state.statsError = null;
                }
            )

            .addCase(
                fetchNotificationStats.fulfilled,
                (state, action) => {
                    state.statsLoading = false;

                    if (action.payload.success) {
                        state.stats = action.payload.data;
                    }
                }
            )

            .addCase(
                fetchNotificationStats.rejected,
                (state, action) => {
                    state.statsLoading = false;

                    state.statsError =
                        action.payload ||
                        "Failed to fetch notification stats";
                }
            );
        builder
            .addCase(fetchAudience.pending, (state) => {
                state.audienceLoading = true;
                state.audienceError = null;
            })

            .addCase(fetchAudience.fulfilled, (state, action) => {
                state.audienceLoading = false;

                if (action.payload.success) {
                    state.audienceUsers =
                        action.payload.data.users;

                    state.audienceCount =
                        action.payload.data.count;
                }
            })

            .addCase(fetchAudience.rejected, (state, action) => {
                state.audienceLoading = false;
                state.audienceError =
                    action.payload ||
                    "Failed to fetch audience";

                state.audienceUsers = [];
                state.audienceCount = 0;
            });
        builder
            .addCase(sendEmailThunk.pending, (state) => {
                state.emailSending = true;
                state.emailError = null;
                state.emailResponse = null;
            })

            .addCase(sendEmailThunk.fulfilled, (state, action) => {
                state.emailSending = false;

                if (action.payload.success) {
                    state.emailResponse = action.payload;
                } else {
                    state.emailError =
                        action.payload.message ||
                        "Failed to send email";
                }
            })

            .addCase(sendEmailThunk.rejected, (state, action) => {
                state.emailSending = false;
                state.emailError =
                    action.payload ||
                    "Failed to send email";
            });
        builder
            .addCase(sendPushThunk.pending, (state) => {
                state.pushSending = true;
                state.pushError = null;
                state.pushResponse = null;
            })

            .addCase(sendPushThunk.fulfilled, (state, action) => {
                state.pushSending = false;

                if (action.payload.success) {
                    state.pushResponse = action.payload;
                } else {
                    state.pushError =
                        action.payload.message ||
                        "Failed to send push notification";
                }
            })

            .addCase(sendPushThunk.rejected, (state, action) => {
                state.pushSending = false;
                state.pushError =
                    action.payload ||
                    "Failed to send push notification";
            });
        builder
            .addCase(
                fetchNotificationById.pending,
                (state) => {
                    state.selectedNotificationLoading =
                        true;

                    state.selectedNotificationError =
                        null;
                }
            )

            .addCase(
                fetchNotificationById.fulfilled,
                (state, action) => {
                    state.selectedNotificationLoading =
                        false;

                    if (action.payload.success) {
                        state.selectedNotification =
                            action.payload.data;
                    }
                }
            )

            .addCase(
                fetchNotificationById.rejected,
                (state, action) => {
                    state.selectedNotificationLoading =
                        false;

                    state.selectedNotificationError =
                        action.payload ||
                        "Failed to fetch notification";
                }
            );
        builder
            .addCase(
                updateNotificationThunk.pending,
                (state) => {
                    state.notificationUpdating = true;

                    state.notificationUpdateError =
                        null;

                    state.notificationUpdateResponse =
                        null;
                }
            )

            .addCase(
                updateNotificationThunk.fulfilled,
                (state, action) => {
                    state.notificationUpdating = false;

                    if (action.payload.success) {
                        state.notificationUpdateResponse =
                            action.payload;

                        state.selectedNotification =
                            action.payload.data;
                    } else {
                        state.notificationUpdateError =
                            action.payload.message ||
                            "Failed to update notification";
                    }
                }
            )

            .addCase(
                updateNotificationThunk.rejected,
                (state, action) => {
                    state.notificationUpdating = false;

                    state.notificationUpdateError =
                        action.payload ||
                        "Failed to update notification";
                }
            );
    },
});

export const {
    clearNotificationError,
    setSelectedNotification,
    clearSelectedNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;