import api from "@/lib/axiosConfiguration";

import type {
    GetCreatorsParams,
    GetCreatorsResponse,
} from "@/types/CreatorsTypes/getCreators.types";

export const getCreators = async (
    params: GetCreatorsParams
): Promise<GetCreatorsResponse> => {

    const response = await api.get(
        "/admin/creators",
        {
            params,
        }
    );

    return response.data;
};