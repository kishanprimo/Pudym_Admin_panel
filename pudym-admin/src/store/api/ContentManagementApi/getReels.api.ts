import api from "@/lib/axiosConfiguration";

import type {
    GetContentParams,
    GetContentResponse,
} from "@/types/ContentManagementTypes/content.types";

export const getReels = async (
    params: GetContentParams
): Promise<GetContentResponse> => {
    const response = await api.get(
        "/admin/social-content/reels",
        {
            params,
        }
    );

    return response.data;
};