import api from "@/lib/axiosConfiguration";

import type {
    GetReactivationRequestsParams,
    GetReactivationRequestsResponse,
} from "@/types/AccountManagementTypes/reactivationRequests.types";

export const getReactivationRequests = async (
    params: GetReactivationRequestsParams
): Promise<GetReactivationRequestsResponse> => {
    const response = await api.get(
        "/admin/account-reactivation",
        {
            params,
        }
    );

    return response.data;
};