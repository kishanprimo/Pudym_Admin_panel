import api from "@/lib/axiosConfiguration";
import type { GetCampaignDetailsResponse } from "@/types/ContentManagementTypes/campaign.types";

export const getCampaignDetails = async (campaignId: number): Promise<GetCampaignDetailsResponse> => {
    const response = await api.get(`/admin/social-content/campaigns/${campaignId}`);
    return response.data;
};
