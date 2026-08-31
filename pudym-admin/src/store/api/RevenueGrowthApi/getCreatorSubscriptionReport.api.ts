import api from "@/lib/axiosConfiguration";

import type {
    CreatorSubscriptionReportResponse,
} from "@/types/RevenueGrowthTypes/creatorSubscriptionReport.types";

export type CreatorSubscriptionPeriod =
    | "today"
    | "week"
    | "month"
    | "year"
    | "custom";

export const getCreatorSubscriptionReport = async (
    period: CreatorSubscriptionPeriod = "month"
): Promise<CreatorSubscriptionReportResponse> => {
    const response = await api.post(
        "/admin/reports/creator-subscriptions",
        {
            period,
        }
    );

    return response.data;
};