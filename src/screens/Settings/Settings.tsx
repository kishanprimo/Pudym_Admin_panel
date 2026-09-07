"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
    Loader2,
    Save,
    ShieldCheck,
    Palette,
    Smartphone,
    Users,
    Bell,
    CreditCard,
    FileText,
    Eye,
    EyeOff,
} from "lucide-react";

import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

import {
    fetchSettings,
    saveSettings,
} from "@/store/slices/SettingsSlices/settingsSlice";

import type {
    SettingsConfig,
} from "@/types/SettingsTypes/settings.types";

/* =========================================================
 * INPUT COMPONENT
 * ========================================================= */

interface InputProps {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    description?: string;
    secret?: boolean;
}

const SettingInput = ({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    description,
    secret = false,
}: InputProps) => {
    const [showPassword, setShowPassword] =
        useState(false);

    const inputType = secret
        ? showPassword
            ? "text"
            : "password"
        : type;

    return (
        <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">
                {label}
            </label>

            <div className="relative">
                <input
                    type={inputType}
                    value={value ?? ""}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                    placeholder={placeholder}
                    className="h-[42px] w-full rounded-[8px] border border-[#D0D5DD] bg-white px-3 text-[14px] text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />

                {secret && (
                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword(
                                (value) => !value
                            )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] transition hover:text-[#344054]"
                    >
                        {showPassword ? (
                            <EyeOff size={17} />
                        ) : (
                            <Eye size={17} />
                        )}
                    </button>
                )}
            </div>

            {description && (
                <p className="mt-1 text-[11px] text-[#98A2B3]">
                    {description}
                </p>
            )}
        </div>
    );
};

/* =========================================================
 * TEXTAREA COMPONENT
 * ========================================================= */

interface TextareaProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
}

const SettingTextarea = ({
    label,
    value,
    onChange,
    placeholder,
    rows = 4,
}: TextareaProps) => {
    return (
        <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">
                {label}
            </label>

            <textarea
                value={value ?? ""}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                placeholder={placeholder}
                rows={rows}
                className="w-full resize-y rounded-[8px] border border-[#D0D5DD] bg-white px-3 py-2.5 text-[14px] text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
            />
        </div>
    );
};

/* =========================================================
 * TOGGLE COMPONENT
 * ========================================================= */

interface ToggleProps {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}

const SettingToggle = ({
    label,
    description,
    checked,
    onChange,
}: ToggleProps) => {
    return (
        <div className="flex items-center justify-between rounded-[10px] border border-[#EAECF0] bg-[#FCFCFD] px-4 py-3.5">
            <div className="pr-4">
                <p className="text-[13px] font-medium text-[#344054]">
                    {label}
                </p>

                {description && (
                    <p className="mt-0.5 text-[11px] text-[#98A2B3]">
                        {description}
                    </p>
                )}
            </div>

            <button
                type="button"
                onClick={() =>
                    onChange(!checked)
                }
                aria-label={`Toggle ${label}`}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked
                    ? "bg-[#2563EB]"
                    : "bg-[#D0D5DD]"
                    }`}
            >
                <span
                    className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition ${checked
                        ? "left-[22px]"
                        : "left-[3px]"
                        }`}
                />
            </button>
        </div>
    );
};

/* =========================================================
 * COLOR INPUT
 * ========================================================= */

interface ColorInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

const ColorInput = ({
    label,
    value,
    onChange,
}: ColorInputProps) => {
    const color =
        /^#[0-9A-F]{6}$/i.test(value)
            ? value
            : "#000000";

    return (
        <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">
                {label}
            </label>

            <div className="flex gap-2">
                <input
                    type="color"
                    value={color}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                    className="h-[42px] w-[50px] cursor-pointer rounded-[8px] border border-[#D0D5DD] bg-white p-1"
                />

                <input
                    type="text"
                    value={value ?? ""}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                    placeholder="#000000"
                    className="h-[42px] flex-1 rounded-[8px] border border-[#D0D5DD] bg-white px-3 text-[14px] text-[#101828] outline-none transition focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
            </div>
        </div>
    );
};

/* =========================================================
 * SECTION COMPONENT
 * ========================================================= */

interface SectionProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    children: React.ReactNode;
}

const SettingsSection = ({
    icon,
    title,
    description,
    children,
}: SectionProps) => {
    return (
        <section className="overflow-hidden rounded-[10px] border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
            {/* Section Header */}
            <div className="border-b border-[#EAECF0] px-6 py-5">
                <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#EFF6FF] text-[#2563EB]">
                        {icon}
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-[15px] font-semibold text-[#101828]">
                            {title}
                        </h2>

                        <p className="mt-0.5 text-[12px] text-[#667085]">
                            {description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Section Content */}
            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                {children}
            </div>
        </section>
    );
};

/* =========================================================
 * SETTINGS NAVIGATION
 * ========================================================= */

const settingsNavigation = [
    {
        id: "general-settings",
        title: "General Settings",
        description: "Basic system settings",
        icon: Palette,
    },
    {
        id: "authentication",
        title: "Authentication",
        description: "Login & authentication",
        icon: ShieldCheck,
    },
    {
        id: "app-branding",
        title: "App / Branding",
        description: "Logo and app configuration",
        icon: Smartphone,
    },

    {
        id: "notifications",
        title: "Notifications / SMS / Email",
        description: "Notification and messaging",
        icon: Bell,
    },
    {
        id: "payment",
        title: "Payment Settings",
        description: "Payment gateway configuration",
        icon: CreditCard,
    },
    {
        id: "legal-storage",
        title: "Storage / Other",
        description: "Legal and storage settings",
        icon: FileText,
    },
];

/* =========================================================
 * MAIN SETTINGS
 * ========================================================= */

const Settings = () => {
    const dispatch = useAppDispatch();

    const {
        settings,
        loading,
        updateLoading,
    } = useAppSelector(
        (state) => state.settings
    );

    const [activeSection, setActiveSection] =
        useState("general-settings");

    const [form, setForm] =
        useState<Partial<SettingsConfig>>({});

    /* =====================================================
     * FETCH SETTINGS
     * ===================================================== */

    useEffect(() => {
        dispatch(fetchSettings());
    }, [dispatch]);

    /* =====================================================
     * LOAD SETTINGS
     * ===================================================== */

    useEffect(() => {
        if (settings) {
            setForm(settings);
        }
    }, [settings]);

    /* =====================================================
     * UPDATE FIELD
     * ===================================================== */

    const updateField = <
        K extends keyof SettingsConfig
    >(
        key: K,
        value: SettingsConfig[K]
    ) => {
        setForm((previous) => ({
            ...previous,
            [key]: value,
        }));
    };

    /* =====================================================
     * SECTION CHANGE
     * ===================================================== */

    const handleSectionChange = (
        sectionId: string
    ) => {
        setActiveSection(sectionId);
    };

    /* =====================================================
     * SAVE SETTINGS
     * ===================================================== */

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        const result = await dispatch(
            saveSettings(form)
        );

        if (
            saveSettings.fulfilled.match(result)
        ) {
            if (result.payload.status) {
                toast.success(
                    result.payload.message ||
                    "Settings updated successfully"
                );
            } else {
                toast.error(
                    result.payload.message ||
                    "Failed to update settings"
                );
            }

            return;
        }

        toast.error(
            result.payload ||
            result.error.message ||
            "Failed to update settings"
        );
    };

    /* =====================================================
     * LOADING
     * ===================================================== */

    if (loading) {
        return (
            <div className="min-h-full bg-[#F8FAFC]">
                {/* Header Skeleton */}
                <div className="border-b border-[#EAECF0] bg-white px-5 py-4 md:px-7">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="h-3 w-36 animate-pulse rounded bg-gray-200" />

                            <div className="mt-3 h-7 w-48 animate-pulse rounded bg-gray-200" />
                        </div>

                        <div className="h-10 w-32 animate-pulse rounded-[8px] bg-gray-200" />
                    </div>
                </div>

                {/* Body Skeleton */}
                <div className="flex min-h-[calc(100vh-120px)]">
                    {/* Sidebar */}
                    <aside className="hidden w-[300px] shrink-0 border-r border-[#EAECF0] bg-white lg:block">
                        <div className="p-5">
                            <div className="mb-5 h-3 w-36 animate-pulse rounded bg-gray-200" />

                            <div className="space-y-2">
                                {Array.from({
                                    length: 7,
                                }).map(
                                    (_, index) => (
                                        <div
                                            key={index}
                                            className="h-[66px] animate-pulse rounded-[9px] bg-gray-100"
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Content */}
                    <main className="flex-1 p-6">
                        <div className="h-[450px] animate-pulse rounded-[10px] bg-white" />
                    </main>
                </div>
            </div>
        );
    }

    const currentNavigation =
        settingsNavigation.find(
            (item) =>
                item.id === activeSection
        );

    /* =====================================================
     * PAGE
     * ===================================================== */

    return (
        <div className="min-h-full bg-[#F8FAFC]">
            {/* =================================================
             * PAGE HEADER
             * ================================================= */}

            <div className="border-b border-[#EAECF0] bg-white px-5 py-4 md:px-7">
                <div className="flex items-center justify-between gap-4">
                    {/* Title */}
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[12px] text-[#667085]">
                            <span>Settings</span>

                            <span className="text-[#98A2B3]">
                                &gt;
                            </span>

                            <span className="truncate font-medium text-[#344054]">
                                {currentNavigation?.title ||
                                    "General Settings"}
                            </span>
                        </div>

                        <h1 className="mt-1 text-[24px] font-semibold tracking-[-0.4px] text-[#101828]">
                            {currentNavigation?.title ||
                                "General Settings"}
                        </h1>
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        form="settings-form"
                        disabled={updateLoading}
                        className="flex h-[40px] shrink-0 items-center gap-2 rounded-[7px] bg-[#2563EB] px-4 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {updateLoading ? (
                            <>
                                <Loader2
                                    size={16}
                                    className="animate-spin"
                                />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* =================================================
             * SETTINGS BODY
             * ================================================= */}

            <div className="flex min-h-[calc(100vh-120px)] flex-col lg:flex-row">
                {/* =================================================
                 * LEFT SETTINGS SIDEBAR
                 * ================================================= */}

                <aside className="w-full shrink-0 border-b border-[#EAECF0] bg-white lg:sticky lg:top-0 lg:h-[calc(100vh-120px)] lg:w-[300px] lg:self-start lg:border-b-0 lg:border-r">
                    <div className="p-5">
                        {/* Sidebar Heading */}
                        <p className="mb-4 px-2 text-[11px] font-semibold uppercase tracking-[1.2px] text-[#667085]">
                            Settings Management
                        </p>

                        {/* Navigation */}
                        <nav className="space-y-1.5">
                            {settingsNavigation.map(
                                (item) => {
                                    const Icon =
                                        item.icon;

                                    const isActive =
                                        activeSection ===
                                        item.id;

                                    return (
                                        <button
                                            key={
                                                item.id
                                            }
                                            type="button"
                                            onClick={() =>
                                                handleSectionChange(
                                                    item.id
                                                )
                                            }
                                            className={`group flex w-full items-start gap-3 rounded-[9px] border px-3.5 py-3.5 text-left transition ${isActive
                                                ? "border-[#D6E4FF] bg-[#EEF4FF]"
                                                : "border-transparent bg-white hover:border-[#EAECF0] hover:bg-[#F9FAFB]"
                                                }`}
                                        >
                                            {/* Icon */}
                                            <div
                                                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] ${isActive
                                                    ? "bg-[#E3EDFF] text-[#2563EB]"
                                                    : "bg-[#F8FAFC] text-[#667085] group-hover:bg-[#F2F4F7]"
                                                    }`}
                                            >
                                                <Icon
                                                    size={
                                                        17
                                                    }
                                                />
                                            </div>

                                            {/* Text */}
                                            <div className="min-w-0 flex-1">
                                                <p
                                                    className={`text-[13px] font-semibold leading-5 ${isActive
                                                        ? "text-[#2563EB]"
                                                        : "text-[#344054]"
                                                        }`}
                                                >
                                                    {
                                                        item.title
                                                    }
                                                </p>

                                                <p className="mt-0.5 text-[11px] leading-4 text-[#667085]">
                                                    {
                                                        item.description
                                                    }
                                                </p>
                                            </div>
                                        </button>
                                    );
                                }
                            )}
                        </nav>
                    </div>
                </aside>

                {/* =================================================
                 * RIGHT CONTENT
                 * ================================================= */}

                <main className="min-w-0 flex-1 bg-[#F8FAFC]">
                    <div className="w-full px-5 py-6 md:px-7 lg:px-8">
                        <form
                            id="settings-form"
                            onSubmit={handleSubmit}
                        >
                            {/* =================================================
                             * 1. GENERAL SETTINGS
                             * ================================================= */}

                            {activeSection ===
                                "general-settings" && (
                                    <SettingsSection
                                        icon={
                                            <Palette
                                                size={18}
                                            />
                                        }
                                        title="General Settings"
                                        description="Configure your application's basic information and visual identity."
                                    >
                                        <SettingInput
                                            label="App Name"
                                            value={
                                                form.app_name ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "app_name",
                                                    value
                                                )
                                            }
                                            placeholder="My Application"
                                        />

                                        <SettingInput
                                            label="App Email"
                                            type="email"
                                            value={
                                                form.app_email ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "app_email",
                                                    value
                                                )
                                            }
                                            placeholder="admin@example.com"
                                        />

                                        <div className="md:col-span-2">
                                            <SettingTextarea
                                                label="App Text"
                                                value={
                                                    form.app_text ||
                                                    ""
                                                }
                                                onChange={(
                                                    value
                                                ) =>
                                                    updateField(
                                                        "app_text",
                                                        value
                                                    )
                                                }
                                                placeholder="Welcome to our application..."
                                                rows={4}
                                            />
                                        </div>




                                        <SettingInput
                                            label="Copyright Text"
                                            value={
                                                form.copyright_text ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "copyright_text",
                                                    value
                                                )
                                            }
                                            placeholder="© 2026 My Application"
                                        />
                                    </SettingsSection>
                                )}

                            {/* =================================================
                             * 2. AUTHENTICATION
                             * ================================================= */}

                            {activeSection ===
                                "authentication" && (
                                    <SettingsSection
                                        icon={
                                            <ShieldCheck
                                                size={18}
                                            />
                                        }
                                        title="Authentication"
                                        description="Control which authentication methods are available to users."
                                    >
                                        <SettingToggle
                                            label="Phone Authentication"
                                            description="Allow users to sign in using their phone number."
                                            checked={
                                                !!form.phone_authentication
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "phone_authentication",
                                                    value
                                                )
                                            }
                                        />

                                        <SettingToggle
                                            label="Email Authentication"
                                            description="Allow users to sign in using email and password."
                                            checked={
                                                !!form.email_authentication
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "email_authentication",
                                                    value
                                                )
                                            }
                                        />

                                        <SettingToggle
                                            label="Google Login"
                                            description="Allow users to authenticate with Google."
                                            checked={
                                                !!form.google_login_authentication
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "google_login_authentication",
                                                    value
                                                )
                                            }
                                        />

                                        <SettingToggle
                                            label="Apple Login"
                                            description="Allow users to authenticate with Apple."
                                            checked={
                                                !!form.apple_login_authentication
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "apple_login_authentication",
                                                    value
                                                )
                                            }
                                        />
                                    </SettingsSection>
                                )}

                            {/* =================================================
                             * 3. APP / BRANDING
                             * ================================================= */}

                            {activeSection ===
                                "app-branding" && (
                                    <SettingsSection
                                        icon={
                                            <Smartphone
                                                size={18}
                                            />
                                        }
                                        title="App / Branding"
                                        description="Configure application logos, splash screen and mobile application links."
                                    >
                                        

                                        <SettingInput
                                            label="iOS App Link"
                                            value={
                                                form.app_ios_link ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "app_ios_link",
                                                    value
                                                )
                                            }
                                            placeholder="https://apps.apple.com/..."
                                        />

                                        <SettingInput
                                            label="Android App Link"
                                            value={
                                                form.app_android_link ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "app_android_link",
                                                    value
                                                )
                                            }
                                            placeholder="https://play.google.com/..."
                                        />

                                    </SettingsSection>
                                )}



                            {/* =================================================
                             * 5. NOTIFICATIONS / SMS / EMAIL
                             * ================================================= */}

                            {activeSection ===
                                "notifications" && (
                                    <SettingsSection
                                        icon={
                                            <Bell
                                                size={18}
                                            />
                                        }
                                        title="Notifications / SMS / Email"
                                        description="Configure push notifications, SMS providers and outgoing email."
                                    >
                                        {/* OneSignal */}
                                        <div className="md:col-span-2">
                                            <div className="border-b border-[#EAECF0] pb-3">
                                                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#667085]">
                                                    OneSignal
                                                </p>
                                            </div>
                                        </div>

                                        <SettingInput
                                            label="OneSignal App ID"
                                            value={
                                                form.one_signal_app_id ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "one_signal_app_id",
                                                    value
                                                )
                                            }
                                        />

                                        <SettingInput
                                            label="OneSignal API Key"
                                            value={
                                                form.one_signal_api_key ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "one_signal_api_key",
                                                    value
                                                )
                                            }
                                            secret
                                        />

                                        <SettingInput
                                            label="Android Channel ID"
                                            value={
                                                form.android_channel_id ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "android_channel_id",
                                                    value
                                                )
                                            }
                                            secret
                                        />

                                        {/* Twilio */}
                                        <div className="md:col-span-2 mt-2">
                                            <div className="border-b border-[#EAECF0] pb-3">
                                                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#667085]">
                                                    Twilio
                                                </p>
                                            </div>
                                        </div>

                                        <SettingInput
                                            label="Account SID"
                                            value={
                                                form.twilio_account_sid ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "twilio_account_sid",
                                                    value
                                                )
                                            }
                                            secret
                                        />
                                        <SettingInput
                                            label="Auth Token"
                                            value={
                                                form.twilio_auth_token ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "twilio_auth_token",
                                                    value
                                                )
                                            }
                                            secret
                                        />

                                        <SettingInput
                                            label="Twilio Phone Number"
                                            value={
                                                form.twilio_phone_number ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "twilio_phone_number",
                                                    value
                                                )
                                            }
                                            secret
                                        />

                                        {/* MSG91 */}
                                        <div className="md:col-span-2 mt-2">
                                            <div className="border-b border-[#EAECF0] pb-3">
                                                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#667085]">
                                                    MSG91
                                                </p>
                                            </div>
                                        </div>

                                        <SettingInput
                                            label="Auth Key"
                                            value={
                                                form.msg_91_auth_key ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "msg_91_auth_key",
                                                    value
                                                )
                                            }
                                            secret
                                        />

                                        <SettingInput
                                            label="Private Key"
                                            value={
                                                form.msg_91_private_key ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "msg_91_private_key",
                                                    value
                                                )
                                            }
                                            secret
                                        />

                                        <SettingInput
                                            label="Template ID"
                                            value={
                                                form.msg_91_template_id ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "msg_91_template_id",
                                                    value
                                                )
                                            }
                                            secret
                                        />

                                        {/* SMTP */}
                                        <div className="md:col-span-2 mt-2">
                                            <div className="border-b border-[#EAECF0] pb-3">
                                                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#667085]">
                                                    SMTP / Email
                                                </p>
                                            </div>
                                        </div>

                                        <SettingInput
                                            label="Email Service"
                                            value={
                                                form.email_service ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "email_service",
                                                    value
                                                )
                                            }
                                            placeholder="smtp"
                                        />

                                        <SettingInput
                                            label="SMTP Host"
                                            value={
                                                form.smtp_host ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "smtp_host",
                                                    value
                                                )
                                            }
                                            placeholder="smtp.example.com"
                                        />

                                        <SettingInput
                                            label="Email"
                                            type="email"
                                            value={
                                                form.email ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "email",
                                                    value
                                                )
                                            }
                                        />

                                        <SettingInput
                                            label="Email Port"
                                            value={
                                                form.email_port ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "email_port",
                                                    value
                                                )
                                            }
                                            placeholder="587"
                                        />

                                        <SettingInput
                                            label="Email Title"
                                            value={
                                                form.email_title ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "email_title",
                                                    value
                                                )
                                            }
                                        />

                                        <SettingInput
                                            label="Email Password"
                                            value={
                                                form.password ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "password",
                                                    value
                                                )
                                            }
                                            secret
                                        />

                                        
                                    </SettingsSection>
                                )}

                            {/* =================================================
                             * 6. PAYMENT
                             * ================================================= */}

                            {activeSection ===
                                "payment" && (
                                    <SettingsSection
                                        icon={
                                            <CreditCard
                                                size={18}
                                            />
                                        }
                                        title="Payment Settings"
                                        description="Configure Stripe, Google Pay, Apple Pay and PayPal payment providers."
                                    >
                                        {/* Stripe */}
                                        <div className="md:col-span-2">
                                            <SettingToggle
                                                label="Enable Stripe"
                                                description="Allow users to make payments using Stripe."
                                                checked={
                                                    !!form.stripe
                                                }
                                                onChange={(
                                                    value
                                                ) =>
                                                    updateField(
                                                        "stripe",
                                                        value
                                                    )
                                                }
                                            />
                                        </div>

                                        <SettingInput
                                            label="Stripe Public Key"
                                            value={
                                                form.stripe_public_key ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "stripe_public_key",
                                                    value
                                                )
                                            }
                                        />

                                        <SettingInput
                                            label="Stripe Secret Key"
                                            value={
                                                form.stripe_secret_key ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "stripe_secret_key",
                                                    value
                                                )
                                            }
                                          
                                        />

                                        {/* Google Pay */}
                                        <div className="md:col-span-2 mt-2">
                                            <div className="border-b border-[#EAECF0] pb-3">
                                                <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#667085]">
                                                    Google Pay
                                                </p>

                                                <SettingToggle
                                                    label="Enable Google Pay"
                                                    description="Allow users to pay using Google Pay."
                                                    checked={
                                                        !!form.gpay
                                                    }
                                                    onChange={(
                                                        value
                                                    ) =>
                                                        updateField(
                                                            "gpay",
                                                            value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <SettingInput
                                            label="Merchant ID"
                                            value={
                                                form.gpay_merch_id ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "gpay_merch_id",
                                                    value
                                                )
                                            }
                                        />

                                        <SettingInput
                                            label="Merchant Name"
                                            value={
                                                form.gpay_merch_name ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "gpay_merch_name",
                                                    value
                                                )
                                            }
                                        />

                                        <SettingInput
                                            label="Country Code"
                                            value={
                                                form.gpay_country_code ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "gpay_country_code",
                                                    value
                                                )
                                            }
                                            placeholder="IN"
                                        />

                                        <SettingInput
                                            label="Currency Code"
                                            value={
                                                form.gpay_currency_code ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "gpay_currency_code",
                                                    value
                                                )
                                            }
                                            placeholder="INR"
                                        />

                                        {/* Apple Pay */}
                                        <div className="md:col-span-2 mt-2">
                                            <div className="border-b border-[#EAECF0] pb-3">
                                                <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#667085]">
                                                    Apple Pay
                                                </p>

                                                <SettingToggle
                                                    label="Enable Apple Pay"
                                                    description="Allow users to pay using Apple Pay."
                                                    checked={
                                                        !!form.apple_pay
                                                    }
                                                    onChange={(
                                                        value
                                                    ) =>
                                                        updateField(
                                                            "apple_pay",
                                                            value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <SettingInput
                                            label="Merchant ID"
                                            value={
                                                form.apple_pay_merch_id ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "apple_pay_merch_id",
                                                    value
                                                )
                                            }
                                        />

                                        <SettingInput
                                            label="Merchant Name"
                                            value={
                                                form.apple_pay_merch_name ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "apple_pay_merch_name",
                                                    value
                                                )
                                            }
                                        />

                                        <SettingInput
                                            label="Country Code"
                                            value={
                                                form.apple_pay_country_code ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "apple_pay_country_code",
                                                    value
                                                )
                                            }
                                            placeholder="IN"
                                        />

                                        <SettingInput
                                            label="Currency Code"
                                            value={
                                                form.apple_pay_currency_code ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "apple_pay_currency_code",
                                                    value
                                                )
                                            }
                                            placeholder="INR"
                                        />

                                        {/* PayPal */}
                                        <div className="md:col-span-2 mt-2">
                                            <div className="border-b border-[#EAECF0] pb-3">
                                                <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#667085]">
                                                    PayPal
                                                </p>

                                                <SettingToggle
                                                    label="Enable PayPal"
                                                    description="Allow users to pay using PayPal."
                                                    checked={
                                                        !!form.paypal
                                                    }
                                                    onChange={(
                                                        value
                                                    ) =>
                                                        updateField(
                                                            "paypal",
                                                            value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <SettingInput
                                            label="PayPal Public Key"
                                            value={
                                                form.paypal_public_key ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "paypal_public_key",
                                                    value
                                                )
                                            }
                                        />

                                        <SettingInput
                                            label="PayPal Secret Key"
                                            value={
                                                form.paypal_secret_key ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "paypal_secret_key",
                                                    value
                                                )
                                            }
                                            
                                        />
                                    </SettingsSection>
                                )}

                            {/* =================================================
                             * 7. STORAGE / OTHER
                             * ================================================= */}

                            {activeSection ===
                                "legal-storage" && (
                                    <SettingsSection
                                        icon={
                                            <FileText
                                                size={18}
                                            />
                                        }
                                        title="Storage / Other"
                                        description="Manage legal content, storage configuration and application-specific settings."
                                    >

                                        {/* Storage */}
                                        <div className="md:col-span-2 mt-2">
                                            <div className="border-b border-[#EAECF0] pb-3">
                                                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#667085]">
                                                    Storage
                                                </p>
                                            </div>
                                        </div>

                                        <SettingInput
                                            label="S3 Region"
                                            value={
                                                form.s3_region ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "s3_region",
                                                    value
                                                )
                                            }
                                            placeholder="ap-south-1"
                                        />

                                        <SettingInput
                                            label="S3 Bucket Name"
                                            value={
                                                form.s3_bucket_name ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "s3_bucket_name",
                                                    value
                                                )
                                            }
                                        />

                                        <SettingInput
                                            label="S3 Access Key ID"
                                            value={
                                                form.s3_access_key_id ||
                                                ""
                                            }
                                            onChange={(value) =>
                                                updateField(
                                                    "s3_access_key_id",
                                                    value
                                                )
                                            }
                                        />

                                        <SettingInput
                                            label="S3 Secret Access Key"
                                            value={
                                                form.s3_secret_access_key ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "s3_secret_access_key",
                                                    value
                                                )
                                            }
                                            
                                        />

                                        <SettingInput
                                            label="Mediaflow"
                                            value={
                                                form.mediaflow ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "mediaflow",
                                                    value
                                                )
                                            }
                                        />

                                        {/* Other */}
                                        <div className="md:col-span-2 mt-2">
                                            <div className="border-b border-[#EAECF0] pb-3">
                                                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#667085]">
                                                    Other
                                                </p>
                                            </div>
                                        </div>

                                        <SettingInput
                                            label="Purchase Code"
                                            value={
                                                form.purchase_code ||
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "purchase_code",
                                                    value
                                                )
                                            }
                                         
                                        />

                                        <SettingInput
                                            label="Referral Coin"
                                            type="number"
                                            value={
                                                form.referral_coin ??
                                                ""
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "referral_coin",
                                                    Number(
                                                        value
                                                    )
                                                )
                                            }
                                        />

                                        <SettingToggle
                                            label="Recharge Enabled"
                                            description="Enable recharge functionality."
                                            checked={
                                                !!form.isRechargeEnable
                                            }
                                            onChange={(
                                                value
                                            ) =>
                                                updateField(
                                                    "isRechargeEnable",
                                                    value
                                                )
                                            }
                                        />

                                        
                                    </SettingsSection>
                                )}
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;