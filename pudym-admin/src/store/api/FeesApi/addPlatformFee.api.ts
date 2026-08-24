import api from "@/lib/axiosConfiguration";

import type {
    AddPlatformFeePayload,
    AddPlatformFeeResponse,
} from "@/types/FeesTypes/fees.types";

export const addPlatformFee = async (
    payload: AddPlatformFeePayload
): Promise<AddPlatformFeeResponse> => {
    const response = await api.post(
        "/admin/platform-fees",
        payload
    );
    return response.data;
};
