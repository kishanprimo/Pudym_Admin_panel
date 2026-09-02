import api from "@/lib/axiosConfiguration";

import type {
    UpdateGiftPayload,
    UpdateGiftResponse,
} from "@/types/GiftsTypes/gifts.types";

export const updateGift = async (
    giftId: number,
    payload: UpdateGiftPayload
): Promise<UpdateGiftResponse> => {

    const formData = new FormData();

    if (payload.name !== undefined) {
        formData.append(
            "name",
            payload.name
        );
    }

    if (payload.gift_value !== undefined) {
        formData.append(
            "gift_value",
            String(payload.gift_value)
        );
    }

    if (
        payload.gift_category_id !== undefined
    ) {
        formData.append(
            "gift_category_id",
            String(payload.gift_category_id)
        );
    }

    if (payload.file_media_1) {
        formData.append(
            "file_media_1",
            payload.file_media_1
        );
    }

    const response = await api.put(
        `/admin/gifts/${giftId}`,
        formData
    );

    return response.data;
};