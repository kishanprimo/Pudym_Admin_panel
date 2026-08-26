export interface ContentReportUser {
    user_id: number;
    full_name: string | null;
    first_name: string | null;
    last_name: string | null;
    user_name: string | null;
    email: string | null;
    profile_pic: string | null;
    role: string | null;
    is_deactivated: boolean;
    is_deleted: boolean;
    blocked_by_admin: boolean;
}

export interface ContentReportMedia {
    media_id: number;
    social_id: number;
    media_location: string | null;
    quality: string | null;
    is_original: boolean;
    aspect_ratio: string | null;
}

export interface ContentReportSocial {
    social_id: number;
    social_desc: string;
    social_type: string;
    campaign_name: string | null;
    campaign_goal: string | null;
    aspect_ratio: string;
    video_hight: string;
    reel_thumbnail: string;
    location: string;
    total_views: number;
    total_saves: number;
    total_shares: number;
    country: string;
    audience_type: string;
    status: boolean;
    deleted_by_user: boolean;
    removed_by_admin: boolean;
    hashtag: string[] | null;
    createdAt: string;
    updatedAt: string;
    user_id: number;

    Media: ContentReportMedia[];

    User: ContentReportUser;
}

export interface ContentReportType {
    report_type_id: number;
    report_text: string;
    report_for: string;
}

export interface ContentReport {
    report_id: number;
    report_type: number | null;
    report_text: string | null;
    createdAt: string;
    updatedAt: string;
    report_type_id: number | null;
    social_id: number;
    reported_by: number;

    User: ContentReportUser;

    Social: ContentReportSocial;

    Report_type: ContentReportType | null;
}

export interface ContentReportsPagination {
    total_pages: number;
    total_records: number;
    current_page: number;
    records_per_page: number;
}

export interface GetContentReportsParams {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
}

export interface GetContentReportsResponse {
    success: boolean;
    message: string;
    data: {
        Records: ContentReport[];
        Pagination: ContentReportsPagination;
    };
}

export interface ContentReportStats {
    total_reports: number;
    active_content: number;
    hidden_content: number;
    removed_content: number;
}

export interface GetContentReportStatsResponse {
    success: boolean;
    message: string;
    data: ContentReportStats;
}
export interface GetContentReportDetailsResponse {
    success: boolean;
    message: string;
    data: ContentReport;
}

export interface UpdateContentStatusResponse {
    success: boolean;
    message: string;
    data: {
        social_id: number;
        status: boolean;
    };
}
export interface DeleteContentResponse {
    success: boolean;
    message: string;
    data: {
        social_id: number;
        removed: boolean;
        status: boolean;
        removed_by_admin: boolean;
    };
}

export interface DeleteContentReportResponse {
    success: boolean;
    message: string;
    data: {
        report_id: number;
        deleted: boolean;
    };
}