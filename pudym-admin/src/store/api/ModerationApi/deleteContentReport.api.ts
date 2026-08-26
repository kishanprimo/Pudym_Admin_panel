import api from "@/lib/axiosConfiguration";

import type {
    DeleteContentReportResponse,
} from "@/types/ModerationTypes/contentReports.types";


export const deleteContentReport =
    async (
        reportId: number
    ): Promise<DeleteContentReportResponse> => {

        const response = await api.delete(
            `/admin/moderation/content-reports/${reportId}`
        );

        return response.data;
    };