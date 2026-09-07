import api from "@/lib/axiosConfiguration";

import type {
    UpdateGiftCategoryStatusPayload,
    UpdateGiftCategoryStatusResponse,
} from "@/types/GiftsTypes/giftCategory.types";

export const updateGiftCategoryStatus = async (
    giftCategoryId: number,
    payload: UpdateGiftCategoryStatusPayload
): Promise<UpdateGiftCategoryStatusResponse> => {
    const response = await api.patch(
        `/admin/gifts/categories/${giftCategoryId}/status`,
        payload
    );

    return response.data;
};