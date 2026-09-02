import api from "@/lib/axiosConfiguration";

import type {
    GetSettingsResponse,
    UpdateSettingsResponse,
    SettingsConfig,
} from "@/types/SettingsTypes/settings.types";

/**
 * Get application settings
 */
export const getSettings =
    async (): Promise<GetSettingsResponse> => {
        const response = await api.get(
            "/admin/settings"
        );

        return response.data;
    };

/**
 * Update application settings
 */
export const updateSettings = async (
    data: Partial<SettingsConfig>
): Promise<UpdateSettingsResponse> => {
    const response = await api.put(
        "/admin/settings",
        data
    );

    return response.data;
};