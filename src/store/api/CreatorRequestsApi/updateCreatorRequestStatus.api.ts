import api from "@/lib/axiosConfiguration";

import type {
    CreatorRequestStatus,
    UpdateCreatorRequestStatusResponse,
} from "@/types/CreatorRequestsTypes/updateCreatorRequestStatus.types";

export const updateCreatorRequestStatus = async (
    userId: number,
    status: CreatorRequestStatus,
    admin_text: string = ""
): Promise<UpdateCreatorRequestStatusResponse> => {
    const response = await api.patch(
        `/admin/creator-requests/${userId}/status`,
        {
            status,
            admin_text,
        }
    );

    return response.data;
};