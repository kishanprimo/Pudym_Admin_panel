export interface CommunicationNotification {
    communication_id: number;
    channel: "email" | "push";
    audience: "all_users" | "creators" | "subscribers";
    title: string;
    message: string;
    total: number;
    sent: number;
    failed: number;
    created_at: string;
    updated_at: string;
}

export interface NotificationPagination {
    total_pages: number;
    total_records: number;
    current_page: number;
    records_per_page: number;
}

export interface GetNotificationsResponse {
    success: boolean;
    message: string;
    data: {
        Records: CommunicationNotification[];
        Pagination: NotificationPagination;
    };
}
export interface GetNotificationResponse {
    success: boolean;

    message: string;

    data: CommunicationNotification;
}
export interface UpdateNotificationPayload {
    channel: NotificationChannel;

    audience: NotificationAudience;

    title: string;

    message: string;
}
export interface UpdateNotificationResponse {
    success: boolean;

    message: string;

    data: CommunicationNotification;
}
export interface NotificationStats {
    total_notifications: number;
    all_users: number;
    creators: number;
    subscribers: number;
}

export interface GetNotificationStatsResponse {
    success: boolean;
    message: string;
    data: NotificationStats;
}

export type NotificationAudience =
    | "all_users"
    | "creators"
    | "subscribers";

export type NotificationChannel =
    | "email"
    | "push";

export interface SendEmailPayload {
    audience: NotificationAudience;
    subject: string;
    message: string;
}

export interface SendPushPayload {
    audience: NotificationAudience;
    title: string;
    message: string;
}

export interface AudienceUser {
    user_id: number;
    email: string;
    role: string;
    has_device_token: boolean;
}

export interface GetAudienceResponse {
    success: boolean;
    message: string;
    data: {
        audience: NotificationAudience;
        count: number;
        users: AudienceUser[];
    };
}

export interface SendCommunicationResponse {
    success: boolean;
    message: string;
    data: {
        audience: NotificationAudience;
        total: number;
        sent: number;
        failed: number;
        sent_emails?: string[];
        failed_emails?: string[];
        total_users?: number;
        users_with_device_token?: number;
        player_ids?: number;
        onesignal?: {
            errors?: string[];
        };
    };
}