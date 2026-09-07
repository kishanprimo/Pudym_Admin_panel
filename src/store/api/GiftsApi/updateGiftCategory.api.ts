import api from "@/lib/axiosConfiguration";

import type {
    UpdateGiftCategoryPayload,
    UpdateGiftCategoryResponse,
} from "@/types/GiftsTypes/giftCategory.types";

export const updateGiftCategory = async (
    giftCategoryId: number,
    payload: UpdateGiftCategoryPayload
): Promise<UpdateGiftCategoryResponse> => {
    const response = await api.put(
        `/admin/gifts/categories/${giftCategoryId}`,
        payload
    );

    return response.data;
};