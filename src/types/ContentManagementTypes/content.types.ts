export interface ContentUser {
    user_id: number;
    user_name: string | null;
    full_name: string | null;
    profile_pic: string | null;
}

export interface ContentMedia {
    media_id: number;
    social_id: number;
    media_location: string;
    aspect_ratio: string | null;
}

export interface SocialContent {
    social_id: number;
    social_desc: string | null;
    social_type: "post" | "reel" | "tweet" | "campaign";
    campaign_name: string | null;
    campaign_goal: string | null;
    aspect_ratio: string | null;
    video_hight: string | null;
    reel_thumbnail: string | null;
    location: string | null;
    total_views: number;
    total_saves: number;
    total_shares: number;
    country: string | null;
    audience_type: string | null;
    status: boolean;
    deleted_by_user: boolean;
    removed_by_admin: boolean;
    hashtag: string[];
    createdAt: string;
    updatedAt: string;
    user_id: number;

    Media: ContentMedia[];
    User: ContentUser;
}

export interface ContentPagination {
    total_pages: number;
    total_records: number;
    current_page: number;
    records_per_page: number;
}

export interface GetContentResponse {
    success: boolean;
    message: string;
    data: {
        Records: SocialContent[];
        Pagination: ContentPagination;
    };
}

export interface GetContentParams {
    page?: number;
    pageSize?: number;
    search?: string;
}