import api from "@/lib/axiosConfiguration";
import type {
    SendCommunicationResponse,
    SendEmailPayload,
} from "@/types/NotificationTypes/notification.types";

export const sendEmail = async (
    payload: SendEmailPayload
): Promise<SendCommunicationResponse> => {
    const response = await api.post(
        "/admin/communication/email",
        payload
    );

    return response.data;
};