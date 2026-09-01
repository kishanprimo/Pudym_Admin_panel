"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Bell,
    Users,
    UserCheck,
    UsersRound,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    fetchNotifications,
    fetchNotificationStats,
    setSelectedNotification,
} from "@/store/slices/NotificationSlices/notificationSlice";

import Tags from "@/components/common/Tags";
import DateTime from "@/components/common/DateTime";
import TableHeader from "@/components/common/TableHeader";
import TableSkeleton from "@/components/common/TableSkeleton";
import Search from "@/components/common/Search";
import Pagination from "@/components/common/Pagination";
import StatsCards from "@/components/common/StatsCard";
import Action from "@/components/common/Action";

const columns = [
    { label: "#", width: "60px" },
    { label: "Title", width: "220px" },
    { label: "Channel", width: "120px" },
    { label: "Audience", width: "140px" },
    { label: "Total", width: "100px" },
    { label: "Sent", width: "100px" },
    { label: "Failed", width: "100px" },
    { label: "Created At", width: "160px" },
    { label: "Action", width: "120px" },
];
const stripHtml = (html: string) => {
    if (!html) return "";

    return html
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};
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

const NotificationList = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const {
        notifications,
        loading,
        error,
        currentPage,
        pageSize,
        totalPages,
        stats,
        statsLoading,
    } = useAppSelector(
        (state) => state.notification
    );

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(
            fetchNotifications({
                page: currentPage,
                pageSize,
                search: searchTerm.trim(),
            })
        );
    }, [
        dispatch,
        currentPage,
        pageSize,
    ]);
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(
                fetchNotifications({
                    page: 1,
                    pageSize,
                    search: searchTerm.trim(),
                })
            );
        }, 1000);

        return () => clearTimeout(timer);
    }, [dispatch, searchTerm, pageSize]);
    useEffect(() => {
        dispatch(fetchNotificationStats());
    }, [dispatch]);

    const handlePageChange = (page: number) => {
        dispatch(
            fetchNotifications({
                page,
                pageSize,
                search: searchTerm.trim(),
            })
        );
    };

    const handleRowsPerPageChange = (rows: number) => {
        dispatch(
            fetchNotifications({
                page: 1,
                pageSize: rows,
                search: searchTerm.trim(),
            })
        );
    };
    const statsData = [
        {
            label: "Total Notifications",
            value: stats.total_notifications,
            icon: (
                <Bell
                    size={26}
                    className="text-blue-600"
                />
            ),
            bg: "bg-blue-50",
        },

        {
            label: "All Users",
            value: stats.all_users,
            icon: (
                <Users
                    size={26}
                    className="text-emerald-600"
                />
            ),
            bg: "bg-emerald-50",
        },

        {
            label: "Creators",
            value: stats.creators,
            icon: (
                <UserCheck
                    size={26}
                    className="text-orange-600"
                />
            ),
            bg: "bg-orange-50",
        },

        {
            label: "Subscribers",
            value: stats.subscribers,
            icon: (
                <UsersRound
                    size={26}
                    className="text-purple-600"
                />
            ),
            bg: "bg-purple-50",
        },
    ];
    const handleView = (notification: typeof notifications[number]) => {
        dispatch(setSelectedNotification(notification));

        router.push("/notifications/view");
    };
    const handleEdit = (
        notification: typeof notifications[number]
    ) => {
        dispatch(
            setSelectedNotification(notification)
        );

        router.push(
            `/notifications/send?edit=${notification.communication_id}`
        );
    };
    return (
        <div className="px-5 py-5 md:px-6 lg:px-7">

            {/* Header */}
            <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                    <h1 className="text-[28px] font-semibold text-[#101828]">
                        Notifications
                    </h1>

                    <p className="mt-1 text-[14px] text-[#667085]">
                        View and manage all communication notifications.
                    </p>
                </div>

                <div className="w-full lg:w-[300px]">
                    <Search
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        placeholder="Search notifications..."
                    />
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
                    {error}
                </div>
            )}
            {/* Stats */}
            <div className="mb-7">
                <StatsCards
                    stats={statsData}
                    cols={4}
                    loading={statsLoading}
                />
            </div>
            {/* Table */}
            <div className="overflow-hidden rounded-[10px] border border-[#EAECF0] bg-white">

                <div className="w-full overflow-x-auto">

                    <table className="w-full table-fixed border-collapse text-left">

                        <TableHeader
                            columns={columns}
                            showCheckbox={false}
                        />

                        <tbody className="divide-y divide-[#EAECF0]">

                            {loading ? (
                                <TableSkeleton rows={5} />

                            ) : notifications.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan={9}
                                        className="px-6 py-16 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center">

                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF]">
                                                <Bell
                                                    size={22}
                                                    className="text-[#2563EB]"
                                                />
                                            </div>

                                            <p className="text-[15px] font-semibold text-[#101828]">
                                                No notifications found
                                            </p>

                                            <p className="mt-1 text-[13px] text-[#667085]">
                                                No communication notifications available.
                                            </p>

                                        </div>
                                    </td>
                                </tr>

                            ) : (

                                notifications.map((notification, index) => (

                                    <tr
                                        key={notification.communication_id}
                                        className="transition-colors hover:bg-[#F9FAFB]"
                                    >

                                        <td className="px-5 py-4 text-[13px] text-[#667085]">
                                            {index + 1}
                                        </td>

                                        <td className="px-5 py-4">

                                            <p className="truncate text-[14px] font-medium text-[#101828]">
                                                {notification.title}
                                            </p>

                                            <p className="mt-0.5 truncate text-[11px] text-[#98A2B3]">
                                                {stripHtml(notification.message)}
                                            </p>

                                        </td>

                                        <td className="px-5 py-4">

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

                                        </td>

                                        <td className="px-5 py-4">

                                            <Tags
                                                text={formatAudience(
                                                    notification.audience
                                                )}
                                                variant={getAudienceVariant(
                                                    notification.audience
                                                )}
                                            />

                                        </td>

                                        <td className="px-5 py-4 text-[13px] text-[#344054]">
                                            {notification.total}
                                        </td>

                                        <td className="px-5 py-4 text-[13px] font-medium text-[#344054]">
                                            {notification.sent}
                                        </td>

                                        <td className="px-5 py-4 text-[13px] text-[#344054]">
                                            {notification.failed}
                                        </td>

                                        <td className="px-5 py-4">

                                            <DateTime
                                                date={formatDate(
                                                    notification.created_at
                                                )}
                                                time={formatTime(
                                                    notification.created_at
                                                )}
                                            />

                                        </td>
                                        <td className="px-5 py-4">
                                            <Action
                                                showView={true}
                                                showEdit={true}
                                                showDelete={false}
                                                showDownload={false}
                                                onView={() => handleView(notification)}
                                                onEdit={() => handleEdit(notification)}
                                            />
                                        </td>
                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* Pagination */}
            {!loading && notifications.length > 0 && (
                <div className="mt-5">

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        rowsPerPage={pageSize}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={
                            handleRowsPerPageChange
                        }
                    />

                </div>
            )}

        </div>
    );
};

export default NotificationList;