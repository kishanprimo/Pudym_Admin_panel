import api from "@/lib/axiosConfiguration";

export const getUserReportStats = async () => {
    const response = await api.get(
        "/admin/moderation/user-reports/stats"
    );

    return response.data;
};