export type CreatorStatus =
    | "active"
    | "deactivated";

export interface CreatorListItem {
    user_id: number;

    user_name: string | null;

    email: string | null;

    mobile_num: string | null;

    country_code: string | null;

    profile_pic: string | null;

    full_name: string | null;

    first_name: string | null;

    last_name: string | null;

    gender: string | null;

    dob: string | null;

    country: string | null;

    state: string | null;

    city: string | null;

    role: string | null;

    admin_approve: string;

    admin_text: string;

    profile_verification_status: boolean;

    is_deactivated: boolean;

    available_coins: string | number;

    total_socials: number;

    createdAt: string;

    updatedAt: string;

    status: CreatorStatus;
}

export interface CreatorsPagination {
    total_pages: number;

    total_records: number;

    current_page: number;

    records_per_page: number;
}

export interface GetCreatorsResponse {
    success: boolean;

    message: string;

    data: {
        Records: CreatorListItem[];

        Pagination: CreatorsPagination;
    };
}

export interface GetCreatorsParams {
    page?: number;

    pageSize?: number;

    search?: string;

    status?: CreatorStatus | "";
}