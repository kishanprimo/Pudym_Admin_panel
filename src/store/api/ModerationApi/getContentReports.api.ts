import api from "@/lib/axiosConfiguration";

import type {
    GetContentReportsParams,
    GetContentReportsResponse,
} from "@/types/ModerationTypes/contentReports.types";

export const getContentReports = async (
    params: GetContentReportsParams
): Promise<GetContentReportsResponse> => {
    const response = await api.get(
        "/admin/moderation/content-reports",
        {
            params,
        }
    );

    return response.data;
};