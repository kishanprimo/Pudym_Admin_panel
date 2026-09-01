export interface UpdateUserStatusPayload {
    is_deactivated: boolean;
    reason: string;
}

export interface UpdateUserStatusResponse {
    success: boolean;
    message: string;

    data: {
        user_id: number;
        is_deactivated: boolean;
        blocked_by_admin: boolean;
        admin_deactivation_reason: string | null;
    };
}