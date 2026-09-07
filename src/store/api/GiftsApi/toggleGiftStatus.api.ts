import api from "@/lib/axiosConfiguration";

import type {
    UpdateGiftStatusPayload,
    UpdateGiftStatusResponse,
} from "@/types/GiftsTypes/gifts.types";

export const updateGiftStatus = async (
    giftId: number,
    payload: UpdateGiftStatusPayload
): Promise<UpdateGiftStatusResponse> => {
    const response = await api.patch(
        `/admin/gifts/${giftId}/status`,
        payload
    );

    return response.data;
};