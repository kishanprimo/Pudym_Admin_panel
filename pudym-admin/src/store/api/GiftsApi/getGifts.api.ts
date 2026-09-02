import api from "@/lib/axiosConfiguration";

import type {
    GetGiftsParams,
    GetGiftsResponse,
} from "@/types/GiftsTypes/gifts.types";

export const getGifts = async (
    params: GetGiftsParams
): Promise<GetGiftsResponse> => {
    const response = await api.post(
        "/admin/gifts/list",
        params
    );

    return response.data;
};