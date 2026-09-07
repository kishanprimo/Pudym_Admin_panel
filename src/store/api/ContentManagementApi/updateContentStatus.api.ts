import api from "@/lib/axiosConfiguration";

export interface UpdateContentStatusResponse {
    success: boolean;
    message: string;
    data: {
        social_id: number;
        status: boolean;
    };
}

export const updateContentStatus = async (
    socialId: number,
    status: boolean
): Promise<UpdateContentStatusResponse> => {
    const response = await api.patch(
        `/admin/social-content/${socialId}/status`,
        {
            status,
        }
    );

    return response.data;
};