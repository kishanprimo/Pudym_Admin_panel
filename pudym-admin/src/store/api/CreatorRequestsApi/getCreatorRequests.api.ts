import api from "@/lib/axiosConfiguration";

import type {
    GetCreatorRequestsParams,
    GetCreatorRequestsResponse,
} from "@/types/CreatorRequestsTypes/getCreatorRequests.types";

export const getCreatorRequests = async (
    params: GetCreatorRequestsParams
): Promise<GetCreatorRequestsResponse> => {
    const response = await api.get(
        "/admin/creator-requests",
        {
            params,
        }
    );

    return response.data;
};