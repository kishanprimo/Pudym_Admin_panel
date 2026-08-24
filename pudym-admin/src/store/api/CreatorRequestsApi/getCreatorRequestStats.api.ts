import api from "@/lib/axiosConfiguration";

import type {
    GetCreatorRequestStatsResponse,
} from "@/types/CreatorRequestsTypes/getCreatorRequestStats.types";

export const getCreatorRequestStats =
    async (): Promise<GetCreatorRequestStatsResponse> => {
        const response = await api.get(
            "/admin/creator-requests/stats"
        );

        return response.data;
    };