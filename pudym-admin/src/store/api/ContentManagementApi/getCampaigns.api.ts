import api from "@/lib/axiosConfiguration";
import type { GetCampaignsResponse } from "@/types/ContentManagementTypes/campaign.types";
import type { GetContentParams } from "@/types/ContentManagementTypes/content.types";

export const getCampaigns = async (params: GetContentParams): Promise<GetCampaignsResponse> => {
    const response = await api.get("/admin/social-content/campaigns", { params });
    return response.data;
};
