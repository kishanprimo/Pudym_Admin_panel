export type ReactivationRequestStatus =
    | "pending"
    | "approved"
    | "rejected";

export interface ReactivationRequest {
    request_id: number;
    user_id: number;
    user_name: string;
    full_name: string;
    email: string;
    role: string;
    request_note: string;
    status: ReactivationRequestStatus;
    admin_note: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ReactivationRequestsPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface GetReactivationRequestsParams {
    page?: number;
    limit?: number;
}

export interface GetReactivationRequestsResponse {
    success: boolean;
    message: string;
    data: ReactivationRequest[];
    pagination: ReactivationRequestsPagination;
}

/*
 * ==========================================
 * CONTENT
 * ==========================================
 *
 * The detail API currently returns content
 * objects without giving us a fixed schema
 * for posts/reels.
 *
 * Keep them flexible until the backend
 * provides the exact post/reel structure.
 */

export interface ReactivationContentItem {
    id?: number | string;
    post_id?: number | string;
    reel_id?: number | string;

    title?: string;
    description?: string;
    caption?: string;

    image?: string;
    image_url?: string;
    thumbnail?: string;
    thumbnail_url?: string;
    media_url?: string;
    video_url?: string;

    createdAt?: string;
    updatedAt?: string;

    [key: string]: unknown;
}

export interface ReactivationRequestDetail {
    request: {
        request_id: number;
        user_id: number;
        status: ReactivationRequestStatus;
        request_note: string;
        admin_note: string | null;
        createdAt: string;
        updatedAt: string;
    };

    user: {
        user_name: string;
        email: string;
        mobile_num: string;
        profile_pic: string;
        background_image: string;
        dob: string;
        platforms: unknown[];

        user_id: number;
        full_name: string;
        first_name: string;
        last_name: string;

        country_code: string;
        country: string;
        country_short_name: string;

        state: string;
        city: string;
        gender: string;

        bio: string;
        role: string;

        is_private: boolean;
        is_deleted: boolean;
        is_deactivated: boolean;
        admin_deactivated: boolean;

        admin_deactivation_reason: string | null;

        blocked_by_admin: boolean;
        admin_block_reason: string | null;

        profile_verification_status: boolean;
        login_verification_status: boolean;

        total_socials: number;
        available_coins: string;

        createdAt: string;
        updatedAt: string;
    };

    content: {
        total_posts: number;
        total_reels: number;
        posts: ReactivationContentItem[];
        reels: ReactivationContentItem[];
    };

    moderation: {
        reports: unknown[];
        removed_content: unknown[];
        archived_content: unknown[];
    };
}

export interface GetReactivationRequestDetailResponse {
    success: boolean;
    message: string;
    data: ReactivationRequestDetail;
}

/*
 * ==========================================
 * APPROVE
 * ==========================================
 */

export interface ApproveReactivationRequestResponse {
    success: boolean;
    message: string;

    data: {
        request_id: number;
        user_id: number;
        request_note: string;
        status: "approved";
        admin_note: string | null;
        createdAt: string;
        updatedAt: string;
    };
}

/*
 * ==========================================
 * REJECT
 * ==========================================
 */

export interface RejectReactivationRequestResponse {
    success: boolean;
    message: string;

    data: {
        request_id: number;
        user_id: number;
        request_note: string;
        status: "rejected";
        admin_note: string;
        createdAt: string;
        updatedAt: string;
    };
}