
export interface UpdateCreatorStatusResponse {
    success: boolean;

    message: string;

    data: {
        user_id: number;

        is_deactivated: boolean;

        admin_deactivation_reason: string | null;

        blocked_by_admin: boolean;

        role: string;
    };
}