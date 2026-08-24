import api from "@/lib/axiosConfiguration";
import type { GetWithdrawalDetailsResponse } from "@/types/WithdrawalTypes/withdrawal.types";

export const getWithdrawalDetails = async (
    transaction_id: number
): Promise<GetWithdrawalDetailsResponse> => {
    const response = await api.post("/admin/withdrawal-details", { transaction_id });
    return response.data;
};
