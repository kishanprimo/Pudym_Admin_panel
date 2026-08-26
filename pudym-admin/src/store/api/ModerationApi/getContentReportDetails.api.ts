import api from "@/lib/axiosConfiguration";

import type {
    GetContentReportDetailsResponse,
} from "@/types/ModerationTypes/contentReports.types";


export const getContentReportDetails =
    async (
        reportId: number
    ): Promise<GetContentReportDetailsResponse> => {

        const response = await api.get(
            `/admin/moderation/content-reports/${reportId}`
        );

        return response.data;
    };