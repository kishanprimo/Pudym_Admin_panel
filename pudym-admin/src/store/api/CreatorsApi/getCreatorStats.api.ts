import api from "@/lib/axiosConfiguration";

import type {
    GetCreatorStatsResponse,
} from "@/types/CreatorsTypes/getCreatorStats.types";

export const getCreatorStats =
    async (): Promise<GetCreatorStatsResponse> => {

        const response = await api.get(
            "/admin/creators/stats"
        );

        return response.data;
    };