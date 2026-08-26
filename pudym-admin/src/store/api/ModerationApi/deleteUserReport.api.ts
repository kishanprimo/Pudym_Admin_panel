import api from "@/lib/axiosConfiguration";

export const deleteUserReport = async (
    reportId: number
) => {
    const response = await api.delete(
        `/admin/moderation/user-reports/${reportId}`
    );

    return response.data;
};