import api from "@/lib/axiosConfiguration";
import type { WithdrawalActionResponse } from "@/types/WithdrawalTypes/withdrawal.types";

export const approveWithdrawal = async (
    transaction_id: number
): Promise<WithdrawalActionResponse> => {
    const formData = new FormData();
    formData.append("transaction_id", String(transaction_id));
    const response = await api.post("/admin/approve-withdrawal", formData);
    return response.data;
};

export const rejectWithdrawal = async (
    transaction_id: number
): Promise<WithdrawalActionResponse> => {
    const formData = new FormData();
    formData.append("transaction_id", String(transaction_id));
    const response = await api.post("/admin/reject-withdrawal", formData);
    return response.data;
};
