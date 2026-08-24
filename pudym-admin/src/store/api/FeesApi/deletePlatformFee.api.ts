import api from "@/lib/axiosConfiguration";

import type { DeletePlatformFeeResponse } from "@/types/FeesTypes/fees.types";

export const deletePlatformFee = async (
    feeType: string
): Promise<DeletePlatformFeeResponse> => {
    const response = await api.post(
        "/admin/delete-platform-fees",
        { fee_type: feeType }
    );
    return response.data;
};
