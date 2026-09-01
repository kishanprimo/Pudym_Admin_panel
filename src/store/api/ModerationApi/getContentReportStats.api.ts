import api from "@/lib/axiosConfiguration";

import type {
    GetContentReportStatsResponse,
} from "@/types/ModerationTypes/contentReports.types";

export const getContentReportStats =
    async (): Promise<GetContentReportStatsResponse> => {
        const response = await api.get(
            "/admin/moderation/content-reports/stats"
        );

        return response.data;
    };