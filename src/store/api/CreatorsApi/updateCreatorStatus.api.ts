import api from "@/lib/axiosConfiguration";

import type {
    UpdateCreatorStatusResponse,
} from "@/types/CreatorsTypes/updateCreatorStatus.types";

export const updateCreatorStatus = async (
    userId: number,
    is_deactivated: boolean,
    reason: string
): Promise<UpdateCreatorStatusResponse> => {

    const response = await api.patch(
        `/admin/creators/${userId}/status`,
        {
            is_deactivated,
            reason,
        }
    );

    return response.data;
};