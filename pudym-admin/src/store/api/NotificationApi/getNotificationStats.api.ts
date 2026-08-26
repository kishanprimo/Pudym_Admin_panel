import api from "@/lib/axiosConfiguration";
import type {
    GetNotificationStatsResponse,
} from "@/types/NotificationTypes/notification.types";

export const getNotificationStats =
    async (): Promise<GetNotificationStatsResponse> => {
        const response = await api.get(
            "/admin/communication/stats"
        );

        return response.data;
    };