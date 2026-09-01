import api from "@/lib/axiosConfiguration";

import type {
    GetReactivationRequestDetailResponse,
} from "@/types/AccountManagementTypes/reactivationRequests.types";

export const getReactivationRequestDetail = async (
    requestId: number
): Promise<GetReactivationRequestDetailResponse> => {
    const response = await api.get(
        `/admin/account-reactivation/${requestId}`
    );

    return response.data;
};