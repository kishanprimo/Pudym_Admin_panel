import api from "@/lib/axiosConfiguration";
import type {
    GetAudienceResponse,
} from "@/types/NotificationTypes/notification.types";

export const getAudience = async (
    audience: "all_users" | "creators" | "subscribers"
): Promise<GetAudienceResponse> => {
    const response = await api.get(
        `/admin/communication/audience/${audience}`
    );

    return response.data;
};