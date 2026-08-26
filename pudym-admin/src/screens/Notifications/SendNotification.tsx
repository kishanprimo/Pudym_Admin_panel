"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import MenuBar from "@/components/common/MenuBar";
import { Bell, Mail, Users, Send, Loader2 } from "lucide-react";
import CustomSelect from "@/components/common/CustomSelect";
import { toast } from "react-toastify";

import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

import {
    fetchAudience,
    sendEmailThunk,
    sendPushThunk,
    fetchNotificationById,
    updateNotificationThunk,
    clearSelectedNotification,
} from "@/store/slices/NotificationSlices/notificationSlice";
import { useSearchParams } from "next/navigation";
import type {
    NotificationAudience,
} from "@/types/NotificationTypes/notification.types";

type Channel = "email" | "push";
const editorLinkConfig = Link.configure({
    openOnClick: false,
    autolink: false,
    linkOnPaste: true,
    defaultProtocol: "https",
    HTMLAttributes: {
        target: "_blank",
        rel: "noopener noreferrer nofollow",
    },
});

const RICH_TEXT_EXTENSIONS = [
    StarterKit,
    Underline,
    TextAlign.configure({
        types: ["heading", "paragraph"],
    }),
    Subscript,
    Superscript,
    Color,
    TextStyle,
    Highlight.configure({
        multicolor: true,
    }),
    FontFamily,
    Image,
    editorLinkConfig,
];

const EDITOR_PROPS = {
    attributes: {
        class: "min-h-[200px] max-h-[300px] overflow-y-auto px-4 py-3 text-sm text-gray-800 outline-none prose prose-sm max-w-none",
    },
};
const SendNotification = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const editId = searchParams.get("edit");
    const isEditMode = Boolean(editId);
    const dispatch = useAppDispatch();

    const {
        audienceCount,
        audienceLoading,
        audienceError,

        emailSending,
        emailError,

        pushSending,
        pushError,

        selectedNotification,
        selectedNotificationLoading,
        selectedNotificationError,

        notificationUpdating,
        notificationUpdateError,
    } = useAppSelector(
        (state) => state.notification
    );
    const [channel, setChannel] =
        useState<Channel>("email");

    const [audience, setAudience] =
        useState<NotificationAudience>("all_users");

    const [title, setTitle] =
        useState("");
    const editor = useEditor({
        extensions: RICH_TEXT_EXTENSIONS,
        content: "",
        editorProps: EDITOR_PROPS,
    });

    /*
     * ==========================================
     * FETCH AUDIENCE
     * ==========================================
     */

    useEffect(() => {
        dispatch(fetchAudience(audience));
    }, [dispatch, audience]);
    useEffect(() => {
        if (!editId) return;

        const communicationId = Number(editId);

        if (!Number.isInteger(communicationId)) {
            toast.error("Invalid notification ID.");
            router.push("/notifications");
            return;
        }

        dispatch(
            fetchNotificationById(communicationId)
        );
    }, [dispatch, editId, router]);
    useEffect(() => {
        if (!selectedNotification) return;
        if (!editor) return;

        setChannel(
            selectedNotification.channel
        );

        setAudience(
            selectedNotification.audience
        );

        setTitle(
            selectedNotification.title
        );

        editor.commands.setContent(
            selectedNotification.message || ""
        );
    }, [
        selectedNotification,
        editor,
    ]);
    /*
     * ==========================================
     * SEND NOTIFICATION
     * ==========================================
     */

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            toast.error("Please enter a title.");
            return;
        }

        if (!editor || editor.isEmpty) {
            toast.error("Please enter a message.");
            return;
        }

        const messageHtml = editor.getHTML();

        if (isEditMode) {
            const communicationId = Number(
                editId
            );

            const result = await dispatch(
                updateNotificationThunk({
                    communicationId,
                    payload: {
                        channel,
                        audience,
                        title: trimmedTitle,
                        message: messageHtml,
                    },
                })
            );

            if (
                updateNotificationThunk.fulfilled.match(
                    result
                )
            ) {
                if (result.payload.success) {
                    toast.success(
                        result.payload.message ||
                        "Notification updated successfully."
                    );

                    dispatch(
                        clearSelectedNotification()
                    );

                    router.push("/notifications");
                } else {
                    toast.error(
                        result.payload.message ||
                        "Failed to update notification."
                    );
                }
            } else {
                toast.error(
                    result.payload ||
                    notificationUpdateError ||
                    "Failed to update notification."
                );
            }

            return;
        }
        if (audienceCount === 0) {
            toast.error(
                "No users found for this audience."
            );
            return;
        }
        /*
         * ==========================================
         * EMAIL
         * ==========================================
         */

        if (channel === "email") {
            const emailPayload = {
                audience,
                subject: trimmedTitle,
                message: messageHtml,
            };

            const result = await dispatch(
                sendEmailThunk(emailPayload)
            );

            if (sendEmailThunk.fulfilled.match(result)) {
                if (result.payload.success) {
                    toast.success(
                        result.payload.message ||
                        "Email sent successfully."
                    );

                    setTitle("");
                    editor.commands.clearContent();

                    router.push("/notifications");
                } else {
                    toast.error(
                        result.payload.message ||
                        "Failed to send email."
                    );
                }
            } else {
                toast.error(
                    result.payload ||
                    emailError ||
                    "Failed to send email."
                );
            }

            return;
        }

        /*
         * ==========================================
         * PUSH
         * ==========================================
         */

        const pushPayload = {
            audience,
            title: trimmedTitle,
            message: messageHtml,
        };

        const result = await dispatch(
            sendPushThunk(pushPayload)
        );

        if (sendPushThunk.fulfilled.match(result)) {
            if (result.payload.success) {
                toast.success(
                    result.payload.message ||
                    "Push notification sent successfully."
                );

                setTitle("");
                editor.commands.clearContent();

                router.push("/notifications");
            } else {
                toast.error(
                    result.payload.message ||
                    "Failed to send push notification."
                );
            }
        } else {
            toast.error(
                result.payload ||
                pushError ||
                "Failed to send push notification."
            );
        }
    };



    const sending =
        channel === "email"
            ? emailSending
            : pushSending;

    return (
        <div className="w-full px-5 py-5 md:px-6 lg:px-7">

            {/* ========================================
                HEADER
            ======================================== */}

            <div className="mb-7">
                <h1 className="text-[28px] font-semibold text-[#101828]">
                    {isEditMode
                        ? "Edit Notification"
                        : "Send Notification"}
                </h1>

                <p className="mt-1 text-[14px] text-[#667085]">
                    {isEditMode
                        ? "Update the notification details without sending it again."
                        : "Send email or push notifications to your users."}
                </p>
            </div>


            {/* ========================================
                MAIN CARD
            ======================================== */}

            <div className="w-full">

                <form
                    onSubmit={handleSubmit}
                    className="w-full rounded-[12px] border border-[#EAECF0] bg-white p-6 shadow-sm"
                >

                    {/* ========================================
                        CHANNEL
                    ======================================== */}

                    <div className="mb-7">

                        <label className="mb-3 block text-[14px] font-semibold text-[#344054]">
                            Notification Channel
                        </label>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                            {/* EMAIL */}

                            <button
                                type="button"
                                onClick={() =>
                                    setChannel("email")
                                }
                                className={`
                                    flex items-center gap-3
                                    rounded-[10px]
                                    border
                                    px-4
                                    py-4
                                    text-left
                                    transition-all
                                    ${channel === "email"
                                        ? "border-[#2563EB] bg-[#EFF6FF]"
                                        : "border-[#D0D5DD] bg-white hover:bg-gray-50"
                                    }
                                `}
                            >

                                <div
                                    className={`
                                        flex h-10 w-10
                                        items-center justify-center
                                        rounded-lg
                                        ${channel === "email"
                                            ? "bg-[#DBEAFE]"
                                            : "bg-gray-100"
                                        }
                                    `}
                                >
                                    <Mail
                                        size={20}
                                        className={
                                            channel === "email"
                                                ? "text-[#2563EB]"
                                                : "text-gray-500"
                                        }
                                    />
                                </div>

                                <div>
                                    <p className="text-[14px] font-semibold text-[#101828]">
                                        Email
                                    </p>

                                    <p className="mt-0.5 text-[12px] text-[#667085]">
                                        Send an email notification
                                    </p>
                                </div>

                            </button>


                            {/* PUSH */}

                            <button
                                type="button"
                                onClick={() =>
                                    setChannel("push")
                                }
                                className={`
                                    flex items-center gap-3
                                    rounded-[10px]
                                    border
                                    px-4
                                    py-4
                                    text-left
                                    transition-all
                                    ${channel === "push"
                                        ? "border-[#2563EB] bg-[#EFF6FF]"
                                        : "border-[#D0D5DD] bg-white hover:bg-gray-50"
                                    }
                                `}
                            >

                                <div
                                    className={`
                                        flex h-10 w-10
                                        items-center justify-center
                                        rounded-lg
                                        ${channel === "push"
                                            ? "bg-[#DBEAFE]"
                                            : "bg-gray-100"
                                        }
                                    `}
                                >
                                    <Bell
                                        size={20}
                                        className={
                                            channel === "push"
                                                ? "text-[#2563EB]"
                                                : "text-gray-500"
                                        }
                                    />
                                </div>

                                <div>
                                    <p className="text-[14px] font-semibold text-[#101828]">
                                        Push Notification
                                    </p>

                                    <p className="mt-0.5 text-[12px] text-[#667085]">
                                        Send a mobile push notification
                                    </p>
                                </div>

                            </button>

                        </div>
                    </div>


                    {/* ========================================
                        AUDIENCE
                    ======================================== */}

                    <div className="mb-7">

                        <label
                            htmlFor="audience"
                            className="mb-2 block text-[14px] font-semibold text-[#344054]"
                        >
                            Audience
                        </label>

                        <CustomSelect
                            value={audience}
                            onChange={(value) =>
                                setAudience(value as NotificationAudience)
                            }
                            options={[
                                {
                                    value: "all_users",
                                    label: "All Users",
                                },
                                {
                                    value: "creators",
                                    label: "Creators",
                                },
                                {
                                    value: "subscribers",
                                    label: "Subscribers",
                                },
                            ]}
                            placeholder="Select audience"
                            searchable={false}
                        />

                        {/* AUDIENCE COUNT */}

                        <div className="mt-3 flex items-center gap-2 rounded-[8px] bg-[#F9FAFB] px-3 py-2.5">

                            <Users
                                size={16}
                                className="text-[#667085]"
                            />

                            {audienceLoading ? (

                                <div className="flex items-center gap-2 text-[13px] text-[#667085]">
                                    <Loader2
                                        size={14}
                                        className="animate-spin"
                                    />
                                    Loading audience...
                                </div>

                            ) : audienceError ? (

                                <p className="text-[13px] text-red-500">
                                    {audienceError}
                                </p>

                            ) : (

                                <p className="text-[13px] text-[#475467]">
                                    <span className="font-semibold text-[#101828]">
                                        {audienceCount}
                                    </span>{" "}
                                    users in this audience
                                </p>

                            )}

                        </div>

                    </div>


                    {/* ========================================
                        TITLE
                    ======================================== */}

                    <div className="mb-6">

                        <label
                            htmlFor="notification-title"
                            className="mb-2 block text-[14px] font-semibold text-[#344054]"
                        >
                            Title
                        </label>

                        <input
                            id="notification-title"
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(
                                    event.target.value
                                )
                            }
                            placeholder="Enter notification title"
                            maxLength={150}
                            className="h-[44px] w-full rounded-[8px] border border-[#D0D5DD] bg-white px-3 text-[14px] text-[#101828] outline-none placeholder:text-[#98A2B3] transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
                        />

                        <p className="mt-1 text-right text-[11px] text-[#98A2B3]">
                            {title.length}/150
                        </p>

                    </div>


                    {/* ========================================
    MESSAGE
======================================== */}

                    <div className="mb-7">

                        <label
                            className="mb-2 block text-[14px] font-semibold text-[#344054]"
                        >
                            Message
                        </label>

                        <div className="overflow-hidden rounded-xl border border-gray-200 transition-all focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/10">

                            <MenuBar
                                editor={editor}
                                showMediaButtons={false}
                                showLinkButton={true}
                            />

                            <EditorContent
                                editor={editor}
                                className="
                                        [&_a]:text-[#2563EB]
                                        [&_a]:underline
                                        [&_a]:cursor-pointer
                                        [&_a]:font-medium
                                        [&_a]:hover:text-[#1D4ED8]
                                    "
                            />

                        </div>

                    </div>


                    {/* ========================================
                        PUSH INFO
                    ======================================== */}

                    {channel === "push" && (
                        <div className="mb-6 rounded-[8px] border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3">

                            <div className="flex gap-3">

                                <Bell
                                    size={18}
                                    className="mt-0.5 shrink-0 text-[#D97706]"
                                />

                                <div>
                                    <p className="text-[13px] font-semibold text-[#92400E]">
                                        Push Notification
                                    </p>

                                    <p className="mt-1 text-[12px] leading-5 text-[#92400E]">
                                        Only users with a valid device
                                        token can receive push
                                        notifications.
                                    </p>
                                </div>

                            </div>

                        </div>
                    )}


                    {/* ========================================
                        SUBMIT
                    ======================================== */}

                    <div className="flex justify-end border-t border-[#EAECF0] pt-5">

                        <button
                            type="submit"
                            disabled={
                                isEditMode
                                    ? notificationUpdating ||
                                    selectedNotificationLoading
                                    : sending ||
                                    audienceLoading ||
                                    audienceCount === 0
                            }
                            className="flex h-[44px] min-w-[150px] items-center justify-center gap-2 rounded-[8px] bg-[#2563EB] px-5 text-[14px] font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            {isEditMode ? (
                                notificationUpdating ? (
                                    <>
                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />

                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Send size={17} />

                                        Update Notification
                                    </>
                                )
                            ) : sending ? (
                                <>
                                    <Loader2
                                        size={17}
                                        className="animate-spin"
                                    />

                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={17} />

                                    Send{" "}
                                    {channel === "email"
                                        ? "Email"
                                        : "Push"}
                                </>
                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );

};

export default SendNotification;