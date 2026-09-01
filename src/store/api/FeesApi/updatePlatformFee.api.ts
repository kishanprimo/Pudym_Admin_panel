import api from "@/lib/axiosConfiguration";

import type {
    UpdatePlatformFeePayload,
    UpdatePlatformFeeResponse,
} from "@/types/FeesTypes/fees.types";

export const updatePlatformFee = async (
    payload: UpdatePlatformFeePayload
): Promise<UpdatePlatformFeeResponse> => {
    const response = await api.post(
        "/admin/update-platform-fees",
        payload
    );
    return response.data;
};
