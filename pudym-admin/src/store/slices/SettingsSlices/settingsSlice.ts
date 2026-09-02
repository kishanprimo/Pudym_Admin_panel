import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getSettings,
    updateSettings,
} from "@/store/api/SettingsApi/settings.api";

import type {
    SettingsConfig,
} from "@/types/SettingsTypes/settings.types";

interface SettingsState {
    settings: SettingsConfig | null;
    loading: boolean;
    updateLoading: boolean;
    error: string | null;
    updateError: string | null;
}

const initialState: SettingsState = {
    settings: null,
    loading: false,
    updateLoading: false,
    error: null,
    updateError: null,
};

/**
 * ==========================================
 * GET SETTINGS
 * ==========================================
 */

export const fetchSettings = createAsyncThunk<
    Awaited<ReturnType<typeof getSettings>>,
    void,
    { rejectValue: string }
>(
    "settings/fetchSettings",
    async (_, { rejectWithValue }) => {
        try {
            return await getSettings();
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch settings"
            );
        }
    }
);

/**
 * ==========================================
 * UPDATE SETTINGS
 * ==========================================
 */

export const saveSettings = createAsyncThunk<
    Awaited<ReturnType<typeof updateSettings>>,
    Partial<SettingsConfig>,
    { rejectValue: string }
>(
    "settings/saveSettings",
    async (data, { rejectWithValue }) => {
        try {
            return await updateSettings(data);
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to update settings"
            );
        }
    }
);

const settingsSlice = createSlice({
    name: "settings",
    initialState,

    reducers: {
        clearSettingsError: (state) => {
            state.error = null;
        },

        clearSettingsUpdateError: (state) => {
            state.updateError = null;
        },
    },

    extraReducers: (builder) => {
        /*
         * ==========================================
         * GET SETTINGS
         * ==========================================
         */

        builder
            .addCase(
                fetchSettings.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                fetchSettings.fulfilled,
                (state, action) => {
                    state.loading = false;

                    if (action.payload.status) {
                        state.settings =
                            action.payload.data;
                    } else {
                        state.error =
                            action.payload.message ||
                            "Failed to fetch settings";
                    }
                }
            )

            .addCase(
                fetchSettings.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error =
                        action.payload ||
                        action.error.message ||
                        "Failed to fetch settings";
                }
            );

        /*
         * ==========================================
         * UPDATE SETTINGS
         * ==========================================
         */

        builder
            .addCase(
                saveSettings.pending,
                (state) => {
                    state.updateLoading = true;
                    state.updateError = null;
                }
            )

            .addCase(
                saveSettings.fulfilled,
                (state, action) => {
                    state.updateLoading = false;

                    if (action.payload.status) {
                        state.settings =
                            action.payload.data;
                    } else {
                        state.updateError =
                            action.payload.message ||
                            "Failed to update settings";
                    }
                }
            )

            .addCase(
                saveSettings.rejected,
                (state, action) => {
                    state.updateLoading = false;

                    state.updateError =
                        action.payload ||
                        action.error.message ||
                        "Failed to update settings";
                }
            );
    },
});

export const {
    clearSettingsError,
    clearSettingsUpdateError,
} = settingsSlice.actions;

export default settingsSlice.reducer;