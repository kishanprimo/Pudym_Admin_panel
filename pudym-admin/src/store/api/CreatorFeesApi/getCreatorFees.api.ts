import api from "@/lib/axiosConfiguration";
import type { GetCreatorFeesResponse } from "@/types/CreatorFeesTypes/creatorFees.types";

export const getCreatorFees = async (): Promise<GetCreatorFeesResponse> => {
    const response = await api.get("/admin/creator-fees/");
    return response.data;
};
