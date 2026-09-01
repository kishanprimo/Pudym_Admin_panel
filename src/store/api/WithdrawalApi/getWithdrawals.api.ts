import api from "@/lib/axiosConfiguration";
import type { GetWithdrawalsResponse } from "@/types/WithdrawalTypes/withdrawal.types";

export const getWithdrawals = async (): Promise<GetWithdrawalsResponse> => {
    const response = await api.get("/admin/withdrawals");
    return response.data;
};
