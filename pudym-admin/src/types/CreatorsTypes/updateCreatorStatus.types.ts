
export interface UpdateCreatorStatusResponse {
    success: boolean;

    message: string;

    data: {
        user_id: number;

        is_deactivated: boolean;

        role: string;
    };
}