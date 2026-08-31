import api from "@/lib/axiosConfiguration";
import type {
    RevenueReportResponse,
} from "@/types/RevenueGrowthTypes/revenueReport.types";

export type ReportPeriod = "today" | "week" | "month" | "year";

export const getRevenueReport = async (
    period: ReportPeriod = "month"
): Promise<RevenueReportResponse> => {
    const response = await api.post("/admin/reports/revenue", {
        period,
    });

    return response.data;
};