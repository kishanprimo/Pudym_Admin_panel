export type CreatorRequestStatus =
    | "under_review"
    | "pending"
    | "approved"
    | "rejected";

export interface CreatorRequestListItem {
    user_id: number;

    user_name: string | null;

    email: string | null;

    profile_pic: string | null;

    full_name: string | null;

    first_name: string | null;

    last_name: string | null;

    role: string | null;

    country: string | null;

    state: string | null;

    city: string | null;

    admin_approve: string;

    admin_text: string;

    purpose_description: string;

    profile_verification_status: boolean;

    createdAt: string;

    updatedAt: string;

    status: CreatorRequestStatus;
}

export interface CreatorRequestsPagination {
    total_pages: number;

    total_records: number;

    current_page: number;

    records_per_page: number;
}

export interface GetCreatorRequestsResponse {
    success: boolean;

    message: string;

    data: {
        Records: CreatorRequestListItem[];

        Pagination: CreatorRequestsPagination;
    };
}

export interface GetCreatorRequestsParams {
    page?: number;

    pageSize?: number;

    search?: string;
}