import api from "@/lib/axiosConfiguration";

import type {
    UpdateContentStatusResponse,
} from "@/types/ModerationTypes/contentReports.types";


export const updateContentStatus =
    async (
        socialId: number,
        status: boolean
    ): Promise<UpdateContentStatusResponse> => {

        const response = await api.patch(
            `/admin/moderation/content/${socialId}/status`,
            {
                status,
            }
        );

        return response.data;
    };