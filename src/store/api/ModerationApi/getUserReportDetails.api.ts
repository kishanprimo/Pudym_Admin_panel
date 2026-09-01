import api from "@/lib/axiosConfiguration";

export const getUserReportDetails = async (
    reportId: number
) => {
    const response = await api.get(
        `/admin/moderation/user-reports/${reportId}`
    );

    return response.data;
};