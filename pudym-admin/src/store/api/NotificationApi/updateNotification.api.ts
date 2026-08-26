import api from "@/lib/axiosConfiguration";
import type {
    UpdateNotificationPayload,
    UpdateNotificationResponse,
} from "@/types/NotificationTypes/notification.types";

export const updateNotification = async (
    communicationId: number,
    payload: UpdateNotificationPayload
): Promise<UpdateNotificationResponse> => {
    const response = await api.put(
        `/admin/communication/notifications/${communicationId}`,
        payload
    );

    return response.data;
};