import api from "@/lib/axiosConfiguration";

export const updateUserStatus = async (
    userId: number,
    isDeactivated: boolean
) => {
    const response = await api.patch(
        `/admin/moderation/users/${userId}/status`,
        {
            is_deactivated: isDeactivated,
        }
    );

    return response.data;
};