import api from "@/lib/axiosConfiguration";

import type {
    DeleteContentResponse,
} from "@/types/ModerationTypes/contentReports.types";


export const deleteContent =
    async (
        socialId: number
    ): Promise<DeleteContentResponse> => {

        const response = await api.delete(
            `/admin/moderation/content/${socialId}`
        );

        return response.data;
    };