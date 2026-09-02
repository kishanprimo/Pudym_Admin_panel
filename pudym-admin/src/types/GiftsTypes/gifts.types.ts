export interface Gift {
    gift_id: number;

    gift_thumbnail: string | null;

    name: string;

    gift_value: number;

    total_use: number;

    status: boolean;

    gift_category_id: number | null;

    gift_category_name?: string | null;

    category?: {
        gift_category_id: number;
        name: string;
    } | null;

    createdAt: string;

    updatedAt: string;
}

export interface GiftsPagination {
    total_pages: number;

    total_records: number;

    current_page: number;

    records_per_page: number;
}

export interface GetGiftsParams {
    page?: number;

    pageSize?: number;

    search?: string;
}

export interface GetGiftsResponse {
    status: boolean;

    data: {
        Records: Gift[];

        Pagination: GiftsPagination;
    };

    message: string;

    toast: boolean;
}

export interface CreateGiftPayload {
    name: string;

    gift_value: number;

    gift_category_id: number;

    file_media_1?: File;
}

export interface CreateGiftResponse {
    status: boolean;

    data: any;

    message: string;

    toast: boolean;
}

export interface UpdateGiftPayload {
    name?: string;

    gift_value?: number;

    gift_category_id?: number;
    file_media_1?: File;
}

export interface UpdateGiftResponse {
    status: boolean;

    data: any;

    message: string;

    toast: boolean;
}

export interface UpdateGiftStatusPayload {
    status: boolean;
}

export interface UpdateGiftStatusResponse {
    status: boolean;

    data: any;

    message: string;

    toast: boolean;
}