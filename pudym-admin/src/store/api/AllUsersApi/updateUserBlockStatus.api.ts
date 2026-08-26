import api from "@/lib/axiosConfiguration";

export interface UpdateUserBlockStatusResponse {
    success: boolean;
    message: string;
    data: {
        user_id: number;
        blocked_by_admin: boolean;
        admin_block_reason: string | null;
        is_deactivated: boolean;
    };
}
export const updateUserBlockStatus = async (
    userId: number,
    blocked_by_admin: boolean,
    reason: string
): Promise<UpdateUserBlockStatusResponse> => {
    const response = await api.patch(
        `/admin/users/${userId}/block`,
        {
            blocked_by_admin,
            reason,
        }
    );

    return response.data;
};