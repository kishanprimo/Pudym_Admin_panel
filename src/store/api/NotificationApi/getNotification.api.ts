import api from "@/lib/axiosConfiguration";
import type {
    GetNotificationResponse,
} from "@/types/NotificationTypes/notification.types";

export const getNotification = async (
    communicationId: number
): Promise<GetNotificationResponse> => {
    const response = await api.get(
        `/admin/communication/notifications/${communicationId}`
    );

    return response.data;
};