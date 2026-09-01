import api from "@/lib/axiosConfiguration";

import type {
    GetCreatorRequestDetailsResponse,
} from "@/types/CreatorRequestsTypes/getCreatorRequestDetails.types";

export const getCreatorRequestDetails = async (
    userId: number
): Promise<GetCreatorRequestDetailsResponse> => {
    const response = await api.get(
        `/admin/creator-requests/${userId}`
    );

    return response.data;
};