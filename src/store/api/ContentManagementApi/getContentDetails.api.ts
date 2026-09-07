import api from "@/lib/axiosConfiguration";

import type {
    GetContentDetailsResponse,
} from "@/types/ContentManagementTypes/contentDetails.types";

export const getContentDetails = async (
    socialId: number
): Promise<GetContentDetailsResponse> => {
    const response = await api.get(
        `/admin/social-content/${socialId}`
    );

    return response.data;
};