import api from "@/lib/axiosConfiguration";
import type {
    SendCommunicationResponse,
    SendPushPayload,
} from "@/types/NotificationTypes/notification.types";

export const sendPush = async (
    payload: SendPushPayload
): Promise<SendCommunicationResponse> => {
    const response = await api.post(
        "/admin/communication/push",
        payload
    );

    return response.data;
};