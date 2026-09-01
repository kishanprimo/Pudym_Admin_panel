import api from "@/lib/axiosConfiguration";

import type {
    ApproveReactivationRequestResponse,
} from "@/types/AccountManagementTypes/reactivationRequests.types";

export const approveReactivationRequest = async (
    requestId: number,
    adminNote?: string
): Promise<ApproveReactivationRequestResponse> => {
    const response = await api.patch(
        `/admin/account-reactivation/${requestId}/approve`,
        adminNote?.trim()
            ? {
                  admin_note: adminNote.trim(),
              }
            : {}
    );

    return response.data;
};