export interface GiftCategory {
    gift_category_id: number;
    name: string;
    status: boolean;
    admin_status: boolean;
    createdAt: string;
    updatedAt: string;
    gift_count: number;
}

export interface GiftCategoriesPagination {
    total_pages: number;

    total_records: number;

    current_page: number;

    records_per_page: number;
}

export interface GetGiftCategoriesParams {
    page?: number;
    pageSize?: number;
    name?: string;
}

export interface GetGiftCategoriesResponse {
    status: boolean;

    data: {
        Records: GiftCategory[];

        Pagination: GiftCategoriesPagination;
    };

    message: string;

    toast: boolean;
}

export interface CreateGiftCategoryPayload {
    name: string;
}

export interface CreateGiftCategoryResponse {
    status: boolean;

    data: Record<string, never>;

    message: string;

    toast: boolean;
}

export interface UpdateGiftCategoryPayload {
    name: string;
}

export interface UpdateGiftCategoryResponse {
    status: boolean;

    data: {
        message: string;

        updated_count: number;
    };

    message: string;

    toast: boolean;
}
export interface UpdateGiftCategoryStatusPayload {
    status: boolean;
}

export interface UpdateGiftCategoryStatusResponse {
    status: boolean;

    data: {
        message: string;
        updated_count: number;
    };

    message: string;

    toast: boolean;
}