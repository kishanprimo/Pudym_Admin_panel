import api from "@/lib/axiosConfiguration";
import type {
    UserGrowthReportResponse,
} from "@/types/RevenueGrowthTypes/userGrowthReport.types";

export type GrowthReportPeriod =
    | "today"
    | "week"
    | "month"
    | "year";

export const getUserGrowthReport = async (
    period: GrowthReportPeriod = "month"
): Promise<UserGrowthReportResponse> => {
    const response = await api.post(
        "/admin/reports/user-growth",
        {
            period,
        }
    );

    return response.data;
};