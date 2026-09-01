import api from "@/lib/axiosConfiguration";

import type {
    RejectReactivationRequestResponse,
} from "@/types/AccountManagementTypes/reactivationRequests.types";

export const rejectReactivationRequest = async (
    requestId: number,
    adminNote: string
): Promise<RejectReactivationRequestResponse> => {
    const response = await api.patch(
        `/admin/account-reactivation/${requestId}/reject`,
        {
            admin_note: adminNote.trim(),
        }
    );

    return response.data;
};