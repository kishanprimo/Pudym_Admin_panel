import api from "@/lib/axiosConfiguration";
import type { GetContentParams, GetContentResponse } from "@/types/ContentManagementTypes/content.types";

export const getTweets = async (params: GetContentParams): Promise<GetContentResponse> => {
    const response = await api.get("/admin/social-content/tweets", { params });
    return response.data;
};
