import api from "@/lib/axiosConfiguration";

import type {
    GetContentParams,
    GetContentResponse,
} from "@/types/ContentManagementTypes/content.types";

export const getPosts = async (
    params: GetContentParams
): Promise<GetContentResponse> => {
    const response = await api.get(
        "/admin/social-content/posts",
        {
            params,
        }
    );

    return response.data;
};