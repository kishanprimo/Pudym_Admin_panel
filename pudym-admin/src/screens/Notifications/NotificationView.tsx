"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Bell,
    Mail,
    Users,
    CheckCircle2,
    XCircle,
    Send,
    CalendarDays,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    clearSelectedNotification,
} from "@/store/slices/NotificationSlices/notificationSlice";

import Tags from "@/components/common/Tags";
import DateTime from "@/components/common/DateTime";

const formatDate = (date: string) => {
    if (!date) return "N/A";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
        return "N/A";
    }

    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatTime = (date: string) => {
    if (!date) return "";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
        return "";
    }

    return d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatAudience = (audience: string) => {
    switch (audience) {
        case "all_users":
            return "All Users";

        case "creators":
            return "Creators";

        case "subscribers":
            return "Subscribers";

        default:
            return audience;
    }
};

const getAudienceVariant = (
    audience: string
): "green" | "orange" | "gray" => {
    switch (audience) {
        case "all_users":
            return "green";

        case "creators":
            return "orange";

        case "subscribers":
            return "gray";

        default:
            return "gray";
    }
};

const getChannelVariant = (
    channel: string
): "green" | "orange" | "gray" => {
    switch (channel) {
        case "email":
            return "green";

        case "push":
            return "orange";

        default:
            return "gray";
    }
};

const NotificationView = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const notification = useAppSelector(
        (state) => state.notification.selectedNotification
    );

    useEffect(() => {
        if (!notification) {
            router.replace("/notifications");
        }
    }, [notification, router]);

    if (!notification) {
        return null;
    }

    const isEmail = notification.channel === "email";

    return (
        <div className="w-full px-5 py-5 md:px-6 lg:px-7">

            {/* Header */}
            <div className="mb-7 flex items-start gap-4">

                <button
                    type="button"
                    onClick={() => {
                        dispatch(clearSelectedNotification());
                        router.push("/notifications");
                    }}
                    className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg border border-[#D0D5DD] bg-white text-[#667085] transition hover:bg-[#F9FAFB] hover:text-[#101828]"
                    title="Back to notifications"
                >
                    <ArrowLeft size={18} />
                </button>

                <div>
                    <h1 className="text-[28px] font-semibold text-[#101828]">
                        Notification Details
                    </h1>

                    <p className="mt-1 text-[14px] text-[#667085]">
                        View complete notification information.
                    </p>
                </div>

            </div>

            {/* Main Card */}
            <div className="overflow-hidden rounded-[12px] border border-[#EAECF0] bg-white shadow-sm">

                {/* Top Section */}
                <div className="border-b border-[#EAECF0] px-6 py-6">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                        <div className="flex items-start gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF]">
                                {isEmail ? (
                                    <Mail
                                        size={22}
                                        className="text-[#2563EB]"
                                    />
                                ) : (
                                    <Bell
                                        size={22}
                                        className="text-[#2563EB]"
                                    />
                                )}
                            </div>

                            <div>
                                <h2 className="text-[20px] font-semibold text-[#101828]">
                                    {notification.title}
                                </h2>

                                <p className="mt-1 text-[13px] text-[#667085]">
                                    Communication ID:{" "}
                                    {notification.communication_id}
                                </p>
                            </div>

                        </div>

                        <div className="flex items-center gap-2">

                            <Tags
                                text={
                                    notification.channel
                                        .charAt(0)
                                        .toUpperCase() +
                                    notification.channel.slice(1)
                                }
                                variant={getChannelVariant(
                                    notification.channel
                                )}
                            />

                            <Tags
                                text={formatAudience(
                                    notification.audience
                                )}
                                variant={getAudienceVariant(
                                    notification.audience
                                )}
                            />

                        </div>

                    </div>

                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 border-b border-[#EAECF0] sm:grid-cols-3">

                    <div className="border-b border-[#EAECF0] px-6 py-5 sm:border-b-0 sm:border-r">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EFF6FF]">
                                <Users
                                    size={18}
                                    className="text-[#2563EB]"
                                />
                            </div>

                            <div>
                                <p className="text-[12px] text-[#667085]">
                                    Total Recipients
                                </p>

                                <p className="mt-0.5 text-[18px] font-semibold text-[#101828]">
                                    {notification.total}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-[#EAECF0] px-6 py-5 sm:border-b-0 sm:border-r">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECFDF3]">
                                <CheckCircle2
                                    size={18}
                                    className="text-[#12B76A]"
                                />
                            </div>

                            <div>
                                <p className="text-[12px] text-[#667085]">
                                    Successfully Sent
                                </p>

                                <p className="mt-0.5 text-[18px] font-semibold text-[#101828]">
                                    {notification.sent}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FEF3F2]">
                                <XCircle
                                    size={18}
                                    className="text-[#F04438]"
                                />
                            </div>

                            <div>
                                <p className="text-[12px] text-[#667085]">
                                    Failed
                                </p>

                                <p className="mt-0.5 text-[18px] font-semibold text-[#101828]">
                                    {notification.failed}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Notification Content */}
                <div className="px-6 py-6">

                    <div className="mb-6">
                        <h3 className="text-[15px] font-semibold text-[#101828]">
                            Notification Content
                        </h3>

                        <p className="mt-1 text-[13px] text-[#667085]">
                            The message that was sent to the selected audience.
                        </p>
                    </div>

                    <div className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB]">

                        <div className="border-b border-[#EAECF0] px-5 py-4">
                            <p className="text-[12px] font-medium text-[#667085]">
                                Title
                            </p>

                            <p className="mt-1 text-[15px] font-semibold text-[#101828]">
                                {notification.title}
                            </p>
                        </div>

                        <div className="px-5 py-5">

                            <p className="mb-2 text-[12px] font-medium text-[#667085]">
                                Message
                            </p>

                            <div
                                className="prose prose-sm max-w-none text-[14px] leading-6 text-[#344054]"
                                dangerouslySetInnerHTML={{
                                    __html: notification.message,
                                }}
                            />

                        </div>

                    </div>

                </div>

                {/* Meta Information */}
                <div className="border-t border-[#EAECF0] bg-[#FCFCFD] px-6 py-6">

                    <h3 className="mb-5 text-[15px] font-semibold text-[#101828]">
                        Notification Information
                    </h3>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <Send
                                    size={14}
                                    className="text-[#667085]"
                                />

                                <p className="text-[12px] font-medium text-[#667085]">
                                    Channel
                                </p>
                            </div>

                            <p className="text-[14px] font-medium capitalize text-[#101828]">
                                {notification.channel}
                            </p>
                        </div>

                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <Users
                                    size={14}
                                    className="text-[#667085]"
                                />

                                <p className="text-[12px] font-medium text-[#667085]">
                                    Audience
                                </p>
                            </div>

                            <p className="text-[14px] font-medium text-[#101828]">
                                {formatAudience(
                                    notification.audience
                                )}
                            </p>
                        </div>

                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <CalendarDays
                                    size={14}
                                    className="text-[#667085]"
                                />

                                <p className="text-[12px] font-medium text-[#667085]">
                                    Created Date
                                </p>
                            </div>

                            <DateTime
                                date={formatDate(
                                    notification.created_at
                                )}
                                time={formatTime(
                                    notification.created_at
                                )}
                            />
                        </div>

                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <Bell
                                    size={14}
                                    className="text-[#667085]"
                                />

                                <p className="text-[12px] font-medium text-[#667085]">
                                    Notification ID
                                </p>
                            </div>

                            <p className="break-all text-[14px] font-medium text-[#101828]">
                                {notification.communication_id}
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default NotificationView;