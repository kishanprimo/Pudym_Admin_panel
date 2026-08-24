import api from "@/lib/axiosConfiguration";
import type {
    UpdateCreatorFeePayload,
    UpdateCreatorFeeResponse,
} from "@/types/CreatorFeesTypes/creatorFees.types";

export const updateCreatorFee = async (
    payload: UpdateCreatorFeePayload
): Promise<UpdateCreatorFeeResponse> => {
    const formData = new FormData();
    formData.append("creator_id", String(payload.creator_id));
    formData.append("fee_type", payload.fee_type);
    formData.append("fee_percentage", String(payload.fee_percentage));

    const response = await api.post("/admin/update-creator-fees", formData);
    return response.data;
};
