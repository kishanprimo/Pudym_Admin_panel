import api from "@/lib/axiosConfiguration";
import type {
    AddCreatorFeePayload,
    AddCreatorFeeResponse,
} from "@/types/CreatorFeesTypes/creatorFees.types";

export const addCreatorFee = async (
    payload: AddCreatorFeePayload
): Promise<AddCreatorFeeResponse> => {
    const response = await api.post("/admin/creator-fees", payload);
    return response.data;
};
