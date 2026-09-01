import api from "@/lib/axiosConfiguration";
import type {
    GetNotificationsResponse,
} from "@/types/NotificationTypes/notification.types";

interface GetNotificationsParams {
    page?: number;
    pageSize?: number;
    search?: string;
    channel?: "email" | "push";
    audience?: "all_users" | "creators" | "subscribers";
}

export const getNotifications = async ({
    page = 1,
    pageSize = 10,
    search,
    channel,
    audience,
}: GetNotificationsParams = {}): Promise<GetNotificationsResponse> => {
    const response = await api.get(
        "/admin/communication/notifications",
        {
            params: {
                page,
                pageSize,
                ...(search?.trim() && {
                    search: search.trim(),
                }),
                ...(channel && { channel }),
                ...(audience && { audience }),
            },
        }
    );

    return response.data;
};