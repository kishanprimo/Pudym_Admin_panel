import api from "@/lib/axiosConfiguration";
import type {
    CreatorGrowthReportResponse,
} from "@/types/RevenueGrowthTypes/creatorGrowthReport.types";

export type CreatorGrowthPeriod =
    | "today"
    | "week"
    | "month"
    | "year";

export const getCreatorGrowthReport = async (
    period: CreatorGrowthPeriod = "month"
): Promise<CreatorGrowthReportResponse> => {
    const response = await api.post(
        "/admin/reports/creator-growth",
        {
            period,
        }
    );

    return response.data;
};