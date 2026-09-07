import type { SocialContent, ContentPagination } from "./content.types";

export interface CampaignSocial extends SocialContent {
    campaign_name: string | null;
    campaign_goal: string | null;
}

export interface Campaign {
    campaign_id: number;
    social_id: number;
    creator_id: number;
    title: string;
    description: string;
    goal_amount: string;
    raised_amount: string;
    post_type: string;
    end_date: string | null;
    is_unlimited: boolean;
    status: string;
    created_at: string;
    updated_at: string;
    Social: CampaignSocial;
    User: {
        user_name: string | null;
        profile_pic: string | null;
        user_id: number;
        full_name: string | null;
    };
}

export interface GetCampaignsResponse {
    success: boolean;
    message: string;
    data: {
        Records: Campaign[];
        Pagination: ContentPagination;
    };
}

export interface GetCampaignDetailsResponse {
    success: boolean;
    message: string;
    data: Campaign;
}
