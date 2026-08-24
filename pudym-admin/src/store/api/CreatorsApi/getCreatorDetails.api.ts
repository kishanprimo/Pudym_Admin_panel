import api from "@/lib/axiosConfiguration";

import type {
    GetCreatorDetailsResponse,
} from "@/types/CreatorsTypes/getCreatorDetails.types";

export const getCreatorDetails = async (
    userId: number
): Promise<GetCreatorDetailsResponse> => {

    const response = await api.get(
        `/admin/creators/${userId}`
    );

    return response.data;
};