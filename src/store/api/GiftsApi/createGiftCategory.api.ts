import api from "@/lib/axiosConfiguration";

import type {
    CreateGiftCategoryPayload,
    CreateGiftCategoryResponse,
} from "@/types/GiftsTypes/giftCategory.types";

export const createGiftCategory = async (
    payload: CreateGiftCategoryPayload
): Promise<CreateGiftCategoryResponse> => {
    const response = await api.post(
        "/admin/gifts/categories",
        payload
    );

    return response.data;
};