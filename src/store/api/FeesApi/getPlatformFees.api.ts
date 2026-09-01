import api from "@/lib/axiosConfiguration";

import type { GetPlatformFeesResponse } from "@/types/FeesTypes/fees.types";

export const getPlatformFees =
    async (): Promise<GetPlatformFeesResponse> => {
        const response = await api.get(
            "/admin/get-platform-fees"
        );
        return response.data;
    };
