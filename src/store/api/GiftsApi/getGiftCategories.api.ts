import api from "@/lib/axiosConfiguration";

import type {
    GetGiftCategoriesParams,
    GetGiftCategoriesResponse,
} from "@/types/GiftsTypes/giftCategory.types";

export const getGiftCategories = async (
    params: GetGiftCategoriesParams
): Promise<GetGiftCategoriesResponse> => {
    const response = await api.post(
        "/admin/gifts/categories/list",
        params
    );

    return response.data;
};