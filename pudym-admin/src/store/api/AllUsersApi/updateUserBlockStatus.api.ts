import api from "@/lib/axiosConfiguration";

export interface UpdateUserBlockStatusResponse {
    success: boolean;
    message: string;
    data: {
        user_id: number;
        blocked_by_admin: boolean;
        is_deactivated: boolean;
    };
}

export const updateUserBlockStatus = async (
    userId: number,
    blocked_by_admin: boolean
): Promise<UpdateUserBlockStatusResponse> => {
    const response = await api.patch(
        `/admin/users/${userId}/block`,
        {
            blocked_by_admin,
        }
    );

    return response.data;
};