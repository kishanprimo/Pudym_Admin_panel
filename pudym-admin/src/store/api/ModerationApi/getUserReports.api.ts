import api from "@/lib/axiosConfiguration";

export interface GetUserReportsParams {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
}

export const getUserReports = async (
    params: GetUserReportsParams = {}
) => {
    const {
        page = 1,
        pageSize = 10,
        search,
        status,
    } = params;

    const response = await api.get(
        "/admin/moderation/user-reports",
        {
            params: {
                page,
                pageSize,
                ...(search
                    ? { search }
                    : {}),
                ...(status
                    ? { status }
                    : {}),
            },
        }
    );

    return response.data;
};