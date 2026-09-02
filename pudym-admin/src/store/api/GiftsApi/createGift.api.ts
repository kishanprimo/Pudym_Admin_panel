import api from "@/lib/axiosConfiguration";

import type {
    CreateGiftPayload,
    CreateGiftResponse,
} from "@/types/GiftsTypes/gifts.types";

export const createGift = async (
    payload: CreateGiftPayload
): Promise<CreateGiftResponse> => {

    const formData = new FormData();

    formData.append("name", payload.name);

    formData.append(
        "gift_value",
        String(payload.gift_value)
    );

    formData.append(
        "gift_category_id",
        String(payload.gift_category_id)
    );

    if (payload.file_media_1) {
        formData.append(
            "file_media_1",
            payload.file_media_1
        );
    }

    const response = await api.post(
        "/admin/gifts",
        formData
    );

    return response.data;
};