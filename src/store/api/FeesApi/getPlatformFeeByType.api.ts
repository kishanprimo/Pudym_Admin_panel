import api from "@/lib/axiosConfiguration";

import type { GetPlatformFeeByTypeResponse } from "@/types/FeesTypes/fees.types";

export const getPlatformFeeByType = async (
    feeType: string
): Promise<GetPlatformFeeByTypeResponse> => {
    const response = await api.get(
        `/admin/platform-fees/${feeType}`
    );
    return response.data;
};
