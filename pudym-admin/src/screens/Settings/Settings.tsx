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
    Database,
    Eye,
    EyeOff,
    Link as LinkIcon,
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


/*
 * ==========================================
 * INPUT COMPONENT
 * ==========================================
 */

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

    const inputType =
        secret
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#344054]"
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


/*
 * ==========================================
 * TEXTAREA COMPONENT
 * ==========================================
 */

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


/*
 * ==========================================
 * TOGGLE COMPONENT
 * ==========================================
 */

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
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    checked
                        ? "bg-[#2563EB]"
                        : "bg-[#D0D5DD]"
                }`}
            >
                <span
                    className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition ${
                        checked
                            ? "left-[22px]"
                            : "left-[3px]"
                    }`}
                />
            </button>
        </div>
    );
};


/*
 * ==========================================
 * COLOR INPUT
 * ==========================================
 */

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
                    className="h-[42px] flex-1 rounded-[8px] border border-[#D0D5DD] px-3 text-[14px] text-[#101828] outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
            </div>
        </div>
    );
};


/*
 * ==========================================
 * SECTION COMPONENT
 * ==========================================
 */

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
        <section className="overflow-hidden rounded-[12px] border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <div className="border-b border-[#EAECF0] px-6 py-5">
                <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#EFF6FF] text-[#2563EB]">
                        {icon}
                    </div>

                    <div>
                        <h2 className="text-[15px] font-semibold text-[#101828]">
                            {title}
                        </h2>

                        <p className="mt-0.5 text-[12px] text-[#667085]">
                            {description}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                {children}
            </div>
        </section>
    );
};


/*
 * ==========================================
 * MAIN SETTINGS
 * ==========================================
 */

const Settings = () => {
    const dispatch = useAppDispatch();

    const {
        settings,
        loading,
        updateLoading,
    } = useAppSelector(
        (state) => state.settings
    );

    const [form, setForm] =
        useState<Partial<SettingsConfig>>({});


    /*
     * ==========================================
     * FETCH SETTINGS
     * ==========================================
     */

    useEffect(() => {
        dispatch(fetchSettings());
    }, [dispatch]);


    /*
     * ==========================================
     * LOAD SETTINGS
     * ==========================================
     */

    useEffect(() => {
        if (settings) {
            setForm(settings);
        }
    }, [settings]);


    /*
     * ==========================================
     * UPDATE FIELD
     * ==========================================
     */

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


    /*
     * ==========================================
     * SAVE
     * ==========================================
     */

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        const result = await dispatch(
            saveSettings(form)
        );

        /*
         * SUCCESS / API RESPONSE
         */

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

        /*
         * THUNK / NETWORK ERROR
         *
         * result.payload is string here,
         * NOT an object containing message.
         */

        toast.error(
            result.payload ||
            result.error.message ||
            "Failed to update settings"
        );
    };


    /*
     * ==========================================
     * LOADING
     * ==========================================
     */

    if (loading) {
        return (
            <div className="min-h-full bg-[#F8FAFC] px-5 py-6 md:px-7">
                <div className="animate-pulse">
                    <div className="mb-2 h-8 w-32 rounded bg-gray-200" />

                    <div className="mb-7 h-4 w-72 rounded bg-gray-100" />

                    <div className="space-y-5">
                        <div className="h-52 rounded-[12px] bg-white" />
                        <div className="h-52 rounded-[12px] bg-white" />
                        <div className="h-52 rounded-[12px] bg-white" />
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-full bg-[#F8FAFC] px-5 py-6 md:px-7">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-[#101828]">
                        Settings
                    </h1>

                    <p className="mt-1 text-[14px] text-[#667085]">
                        Manage your application configuration,
                        authentication, branding and integrations.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-[#D1FAE5] bg-[#ECFDF3] px-3 py-1.5 text-[12px] font-medium text-[#027A48]">
                    <ShieldCheck size={14} />
                    Admin Configuration
                </div>
            </div>


            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                {/* ==========================================
                    1. GENERAL SETTINGS
                ========================================== */}

                <SettingsSection
                    icon={<Palette size={18} />}
                    title="General Settings"
                    description="Configure your application's basic information and visual identity."
                >
                    <SettingInput
                        label="App Name"
                        value={form.app_name || ""}
                        onChange={(value) =>
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
                        value={form.app_email || ""}
                        onChange={(value) =>
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
                            value={form.app_text || ""}
                            onChange={(value) =>
                                updateField(
                                    "app_text",
                                    value
                                )
                            }
                            placeholder="Welcome to our application..."
                        />
                    </div>

                    <ColorInput
                        label="Primary Color"
                        value={
                            form.app_primary_color ||
                            ""
                        }
                        onChange={(value) =>
                            updateField(
                                "app_primary_color",
                                value
                            )
                        }
                    />

                    <ColorInput
                        label="Secondary Color"
                        value={
                            form.app_secondary_color ||
                            ""
                        }
                        onChange={(value) =>
                            updateField(
                                "app_secondary_color",
                                value
                            )
                        }
                    />

                    <SettingInput
                        label="Copyright Text"
                        value={
                            form.copyright_text || ""
                        }
                        onChange={(value) =>
                            updateField(
                                "copyright_text",
                                value
                            )
                        }
                        placeholder="© 2026 My Application"
                    />
                </SettingsSection>


                {/* ==========================================
                    2. AUTHENTICATION
                ========================================== */}

                <SettingsSection
                    icon={<ShieldCheck size={18} />}
                    title="Authentication"
                    description="Control which authentication methods are available to users."
                >
                    <SettingToggle
                        label="Phone Authentication"
                        description="Allow users to sign in using their phone number."
                        checked={
                            !!form.phone_authentication
                        }
                        onChange={(value) =>
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
                        onChange={(value) =>
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
                        onChange={(value) =>
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
                        onChange={(value) =>
                            updateField(
                                "apple_login_authentication",
                                value
                            )
                        }
                    />
                </SettingsSection>


                {/* ==========================================
                    3. APP / BRANDING
                ========================================== */}

                <SettingsSection
                    icon={<Smartphone size={18} />}
                    title="App / Branding"
                    description="Configure application logos, splash screen and mobile application links."
                >
                    <SettingInput
                        label="App Light Logo"
                        value={
                            form.app_logo_light || ""
                        }
                        onChange={(value) =>
                            updateField(
                                "app_logo_light",
                                value
                            )
                        }
                        placeholder="https://..."
                    />

                    <SettingInput
                        label="App Dark Logo"
                        value={
                            form.app_logo_dark || ""
                        }
                        onChange={(value) =>
                            updateField(
                                "app_logo_dark",
                                value
                            )
                        }
                        placeholder="https://..."
                    />

                    <SettingInput
                        label="Web Light Logo"
                        value={
                            form.web_logo_light || ""
                        }
                        onChange={(value) =>
                            updateField(
                                "web_logo_light",
                                value
                            )
                        }
                        placeholder="https://..."
                    />

                    <SettingInput
                        label="Web Dark Logo"
                        value={
                            form.web_logo_dark || ""
                        }
                        onChange={(value) =>
                            updateField(
                                "web_logo_dark",
                                value
                            )
                        }
                        placeholder="https://..."
                    />

                    <SettingInput
                        label="Splash Image"
                        value={
                            form.splash_image || ""
                        }
                        onChange={(value) =>
                            updateField(
                                "splash_image",
                                value
                            )
                        }
                        placeholder="https://..."
                    />

                    <SettingInput
                        label="iOS App Link"
                        value={
                            form.app_ios_link || ""
                        }
                        onChange={(value) =>
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
                            form.app_android_link || ""
                        }
                        onChange={(value) =>
                            updateField(
                                "app_android_link",
                                value
                            )
                        }
                        placeholder="https://play.google.com/..."
                    />

                    <SettingInput
                        label="Tell a Friend Text"
                        value={
                            form.app_tell_a_friend_text ||
                            ""
                        }
                        onChange={(value) =>
                            updateField(
                                "app_tell_a_friend_text",
                                value
                            )
                        }
                        placeholder="Invite your friends..."
                    />
                </SettingsSection>


                {/* ==========================================
                    4. GROUP / CONTACT
                ========================================== */}

                <SettingsSection
                    icon={<Users size={18} />}
                    title="Group / Contact Settings"
                    description="Configure group limits and contact visibility."
                >
                    <SettingInput
                        label="Maximum Members in Group"
                        type="number"
                        value={
                            form.maximum_members_in_group ??
                            ""
                        }
                        onChange={(value) =>
                            updateField(
                                "maximum_members_in_group",
                                Number(value)
                            )
                        }
                        placeholder="100"
                    />

                    <div />

                    <SettingToggle
                        label="Show All Contacts"
                        description="Allow users to see all available contacts."
                        checked={
                            !!form.show_all_contatcts
                        }
                        onChange={(value) =>
                            updateField(
                                "show_all_contatcts",
                                value
                            )
                        }
                    />

                    <SettingToggle
                        label="Show Phone Contacts"
                        description="Display phone contacts inside the application."
                        checked={
                            !!form.show_phone_contatcs
                        }
                        onChange={(value) =>
                            updateField(
                                "show_phone_contatcs",
                                value
                            )
                        }
                    />
                </SettingsSection>


                {/* ==========================================
                    5. NOTIFICATIONS / SMS / EMAIL
                ========================================== */}

                <SettingsSection
                    icon={<Bell size={18} />}
                    title="Notifications / SMS / Email"
                    description="Configure push notifications, SMS providers and outgoing email."
                >
                    {/* OneSignal */}

                    <div className="md:col-span-2">
                        <div className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-[#667085]">
                            OneSignal
                        </div>
                    </div>

                    <SettingInput
                        label="OneSignal App ID"
                        value={
                            form.one_signal_app_id || ""
                        }
                        onChange={(value) =>
                            updateField(
                                "one_signal_app_id",
                                value
                            )
                        }
                    />

                    <SettingInput
                        label="OneSignal API Key"
                        value={
                            form.one_signal_api_key || ""
                        }
                        onChange={(value) =>
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
                            form.android_channel_id || ""
                        }
                        onChange={(value) =>
                            updateField(
                                "android_channel_id",
                                value
                            )
                        }
                    />

                    {/* Twilio */}

                    <div className="md:col-span-2 mt-2">
                        <div className="border-t border-[#EAECF0] pt-5">
                            <div className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-[#667085]">
                                Twilio
                            </div>
                        </div>
                    </div>

                    <SettingInput
                        label="Account SID"
                        value={
                            form.twilio_account_sid ||
                            ""
                        }
                        onChange={(value) =>
                            updateField(
                                "twilio_account_sid",
                                value
                            )
                        }
                    />

                    <SettingInput
                        label="Auth Token"
                        value={
                            form.twilio_auth_token ||
                            ""
                        }
                        onChange={(value) =>
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
                        onChange={(value) =>
                            updateField(
                                "twilio_phone_number",
                                value
                            )
                        }
                    />

                    {/* MSG91 */}

                    <div className="md:col-span-2 mt-2">
                        <div className="border-t border-[#EAECF0] pt-5">
                            <div className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-[#667085]">
                                MSG91
                            </div>
                        </div>
                    </div>

                    <SettingInput
                        label="Auth Key"
                        value={
                            form.msg_91_auth_key || ""
                        }
                        onChange={(value) =>
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
                        onChange={(value) =>
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
                        onChange={(value) =>
                            updateField(
                                "msg_91_template_id",
                                value
                            )
                        }
                    />

                    {/* SMTP */}

                    <div className="md:col-span-2 mt-2">
                        <div className="border-t border-[#EAECF0] pt-5">
                            <div className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-[#667085]">
                                SMTP / Email
                            </div>
                        </div>
                    </div>

                    <SettingInput
                        label="Email Service"
                        value={
                            form.email_service || ""
                        }
                        onChange={(value) =>
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
                            form.smtp_host || ""
                        }
                        onChange={(value) =>
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
                            form.email || ""
                        }
                        onChange={(value) =>
                            updateField(
                                "email",
                                value
                            )
                        }
                    />

                    <SettingInput
                        label="Email Port"
                        value={
                            form.email_port || ""
                        }
                        onChange={(value) =>
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
                            form.email_title || ""
                        }
                        onChange={(value) =>
                            updateField(
                                "email_title",
                                value
                            )
                        }
                    />

                    <SettingInput
                        label="Email Password"
                        value={
                            form.password || ""
                        }
                        onChange={(value) =>
                            updateField(
                                "password",
                                value
                            )
                        }
                        secret
                    />

                    <SettingInput
                        label="Email Banner"
                        value={
                            form.email_banner || ""
                        }
                        onChange={(value) =>
                            updateField(
                                "email_banner",
                                value
                            )
                        }
                        placeholder="https://..."
                    />
                </SettingsSection>


                {/* ==========================================
                    6. PAYMENT
                ========================================== */}

                <SettingsSection
                    icon={<CreditCard size={18} />}
                    title="Payment Settings"
                    description="Configure Stripe, Google Pay, Apple Pay and PayPal payment providers."
                >
                    {/* Stripe */}

                    <div className="md:col-span-2">
                        <SettingToggle
                            label="Enable Stripe"
                            description="Allow users to make payments using Stripe."
                            checked={!!form.stripe}
                            onChange={(value) =>
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
                        onChange={(value) =>
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
                        onChange={(value) =>
                            updateField(
                                "stripe_secret_key",
                                value
                            )
                        }
                        secret
                    />

                    {/* Google Pay */}

                    <div className="md:col-span-2 mt-2">
                        <div className="border-t border-[#EAECF0] pt-5">
                            <div className="mb-4 text-[12px] font-semibold uppercase tracking-wide text-[#667085]">
                                Google Pay
                            </div>

                            <SettingToggle
                                label="Enable Google Pay"
                                description="Allow users to pay using Google Pay."
                                checked={!!form.gpay}
                                onChange={(value) =>
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
                            form.gpay_merch_id || ""
                        }
                        onChange={(value) =>
                            updateField(
                                "gpay_merch_id",
                                value
                            )
                        }
                    />

                    <SettingInput
                        label="Merchant Name"
                        value={
                            form.gpay_merch_name || ""
                        }
                        onChange={(value) =>
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
                        onChange={(value) =>
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
                        onChange={(value) =>
                            updateField(
                                "gpay_currency_code",
                                value
                            )
                        }
                        placeholder="INR"
                    />

                    {/* Apple Pay */}

                    <div className="md:col-span-2 mt-2">
                        <div className="border-t border-[#EAECF0] pt-5">
                            <div className="mb-4 text-[12px] font-semibold uppercase tracking-wide text-[#667085]">
                                Apple Pay
                            </div>

                            <SettingToggle
                                label="Enable Apple Pay"
                                description="Allow users to pay using Apple Pay."
                                checked={
                                    !!form.apple_pay
                                }
                                onChange={(value) =>
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
                        onChange={(value) =>
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
                        onChange={(value) =>
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
                        onChange={(value) =>
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
                        onChange={(value) =>
                            updateField(
                                "apple_pay_currency_code",
                                value
                            )
                        }
                        placeholder="INR"
                    />

                    {/* PayPal */}

                    <div className="md:col-span-2 mt-2">
                        <div className="border-t border-[#EAECF0] pt-5">
                            <div className="mb-4 text-[12px] font-semibold uppercase tracking-wide text-[#667085]">
                                PayPal
                            </div>

                            <SettingToggle
                                label="Enable PayPal"
                                description="Allow users to pay using PayPal."
                                checked={!!form.paypal}
                                onChange={(value) =>
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
                        onChange={(value) =>
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
                        onChange={(value) =>
                            updateField(
                                "paypal_secret_key",
                                value
                            )
                        }
                        secret
                    />
                </SettingsSection>


                {/* ==========================================
                    7. LEGAL / STORAGE / OTHER
                ========================================== */}

                <SettingsSection
                    icon={<FileText size={18} />}
                    title="Legal / Storage / Other"
                    description="Manage legal content, storage configuration and application-specific settings."
                >
                    {/* Legal */}

                    <div className="md:col-span-2">
                        <div className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-[#667085]">
                            Legal
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <SettingTextarea
                            label="Privacy Policy"
                            value={
                                form.privacy_policy ||
                                ""
                            }
                            onChange={(value) =>
                                updateField(
                                    "privacy_policy",
                                    value
                                )
                            }
                        />
                    </div>

                    <div className="md:col-span-2">
                        <SettingTextarea
                            label="Terms & Conditions"
                            value={
                                form.terms_and_conditions ||
                                ""
                            }
                            onChange={(value) =>
                                updateField(
                                    "terms_and_conditions",
                                    value
                                )
                            }
                        />
                    </div>

                    <div className="md:col-span-2">
                        <SettingTextarea
                            label="Delete Account Information"
                            value={
                                form.delete_account ||
                                ""
                            }
                            onChange={(value) =>
                                updateField(
                                    "delete_account",
                                    value
                                )
                            }
                        />
                    </div>

                    {/* Storage */}

                    <div className="md:col-span-2 mt-2">
                        <div className="border-t border-[#EAECF0] pt-5">
                            <div className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-[#667085]">
                                Storage
                            </div>
                        </div>
                    </div>

                    <SettingInput
                        label="S3 Region"
                        value={
                            form.s3_region || ""
                        }
                        onChange={(value) =>
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
                            form.s3_bucket_name || ""
                        }
                        onChange={(value) =>
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
                        secret
                    />

                    <SettingInput
                        label="S3 Secret Access Key"
                        value={
                            form.s3_secret_access_key ||
                            ""
                        }
                        onChange={(value) =>
                            updateField(
                                "s3_secret_access_key",
                                value
                            )
                        }
                        secret
                    />

                    <SettingInput
                        label="Mediaflow"
                        value={
                            form.mediaflow || ""
                        }
                        onChange={(value) =>
                            updateField(
                                "mediaflow",
                                value
                            )
                        }
                    />

                    {/* Other */}

                    <div className="md:col-span-2 mt-2">
                        <div className="border-t border-[#EAECF0] pt-5">
                            <div className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-[#667085]">
                                Other
                            </div>
                        </div>
                    </div>

                    <SettingInput
                        label="Purchase Code"
                        value={
                            form.purchase_code || ""
                        }
                        onChange={(value) =>
                            updateField(
                                "purchase_code",
                                value
                            )
                        }
                        secret
                    />

                    <SettingInput
                        label="Referral Coin"
                        type="number"
                        value={
                            form.referral_coin ?? ""
                        }
                        onChange={(value) =>
                            updateField(
                                "referral_coin",
                                Number(value)
                            )
                        }
                    />

                    <SettingToggle
                        label="Recharge Enabled"
                        description="Enable recharge functionality."
                        checked={
                            !!form.isRechargeEnable
                        }
                        onChange={(value) =>
                            updateField(
                                "isRechargeEnable",
                                value
                            )
                        }
                    />

                    <SettingToggle
                        label="Extended Mode"
                        description="Enable extended application functionality."
                        checked={
                            !!form.is_extended
                        }
                        onChange={(value) =>
                            updateField(
                                "is_extended",
                                value
                            )
                        }
                    />

                    <SettingToggle
                        label="Demo Mode"
                        description="Enable demo mode for the application."
                        checked={
                            !!form.is_demo
                        }
                        onChange={(value) =>
                            updateField(
                                "is_demo",
                                value
                            )
                        }
                    />
                </SettingsSection>


                {/* ==========================================
                    SAVE BAR
                ========================================== */}

                <div className="sticky bottom-4 z-10 flex items-center justify-between rounded-[12px] border border-[#D0D5DD] bg-white/95 px-5 py-4 shadow-lg backdrop-blur">

                    <div className="hidden sm:block">
                        <p className="text-[13px] font-medium text-[#344054]">
                            Configuration changes
                        </p>

                        <p className="text-[11px] text-[#667085]">
                            Save your changes to apply them.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={updateLoading}
                        className="ml-auto flex h-[42px] items-center gap-2 rounded-[8px] bg-[#2563EB] px-5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
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
            </form>
        </div>
    );
};

export default Settings;