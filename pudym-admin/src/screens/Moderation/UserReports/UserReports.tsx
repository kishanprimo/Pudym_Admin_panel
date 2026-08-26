"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
    FileWarning,
    Eye,
    Trash2,
    Users,
    UserCheck,
    UserX,
} from "lucide-react";

import { useRouter } from "next/navigation";

import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

import {
    fetchUserReports,
    fetchUserReportStats,
    changeUserStatus,
    removeUserReport,
} from "@/store/slices/ModerationSlices/userReportsSlice";

import StatsCards from "@/components/common/StatsCard";
import Search from "@/components/common/Search";
import TableHeader from "@/components/common/TableHeader";
import Pagination from "@/components/common/Pagination";
import Tags from "@/components/common/Tags";
import DateTime from "@/components/common/DateTime";
import TableSkeleton from "@/components/common/TableSkeleton";
import TogglableSwitch from "@/components/common/TogglableSwitch";
import UserDeleteModal from "@/components/common/UserDeleteModal";

const UserReports = () => {
    const router = useRouter();

    const dispatch = useAppDispatch();

    const {
        reports,
        pagination,
        stats,
        loading,
        statsLoading,
        statusLoadingUserId,
        deleteReportLoading,
        deleteReportLoadingId,
    } = useAppSelector(
        (state) => state.userReports
    );

    /*
     * ==========================================
     * SEARCH
     * ==========================================
     */

    const [searchInput, setSearchInput] =
        useState("");

    const [searchTerm, setSearchTerm] =
        useState("");

    /*
     * ==========================================
     * STATUS FILTER
     * ==========================================
     */

    const [statusFilter, setStatusFilter] =
        useState("");

    /*
     * ==========================================
     * PAGINATION
     * ==========================================
     */

    const [currentPage, setCurrentPage] =
        useState(1);

    const [rowsPerPage, setRowsPerPage] =
        useState(10);

    /*
     * ==========================================
     * DELETE
     * ==========================================
     */

    const [deleteReportId, setDeleteReportId] =
        useState<number | null>(null);

    /*
     * ==========================================
     * FETCH USER REPORTS
     * ==========================================
     */

    useEffect(() => {
        dispatch(
            fetchUserReports({
                page: currentPage,
                pageSize: rowsPerPage,
                search: searchTerm,
                status: statusFilter,
            })
        );
    }, [
        dispatch,
        currentPage,
        rowsPerPage,
        searchTerm,
        statusFilter,
    ]);

    /*
     * ==========================================
     * FETCH USER REPORT STATS
     * ==========================================
     */

    useEffect(() => {
        dispatch(
            fetchUserReportStats()
        );
    }, [dispatch]);

    /*
     * ==========================================
     * SEARCH
     * ==========================================
     */

    const handleSearchChange = (
        value: string
    ) => {
        setSearchInput(value);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setCurrentPage(1);
        }, 1000);

        return () =>
            clearTimeout(timer);
    }, [searchInput]);

    /*
     * ==========================================
     * STATUS FILTER
     * ==========================================
     */

    const handleStatusChange = (
        status: string
    ) => {
        setStatusFilter(status);
        setCurrentPage(1);
    };

    /*
     * ==========================================
     * PAGINATION
     * ==========================================
     */

    const handlePageChange = (
        page: number
    ) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (
        rows: number
    ) => {
        setRowsPerPage(rows);
        setCurrentPage(1);
    };

    /*
     * ==========================================
     * USER FORMATTERS
     * ==========================================
     */

    const getUserName = (
        user: any
    ) => {
        return (
            user?.full_name ||
            `${user?.first_name || ""} ${user?.last_name || ""
                }`.trim() ||
            "Unknown"
        );
    };

    const getUsername = (
        user: any
    ) => {
        if (!user?.user_name) {
            return "N/A";
        }

        return `@${user.user_name.replace(
            /^@/,
            ""
        )}`;
    };

    const getAvatarText = (
        user: any
    ) => {
        const name =
            getUserName(user);

        const words = name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (words.length >= 2) {
            return `${words[0][0]}${words[1][0]}`
                .toUpperCase();
        }

        return (
            words[0]
                ?.slice(0, 2)
                .toUpperCase() ||
            "U"
        );
    };

    /*
     * ==========================================
     * DATE FORMATTERS
     * ==========================================
     */

    const formatDate = (
        date: string
    ) => {
        if (!date) {
            return "N/A";
        }

        return new Date(
            date
        ).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const formatTime = (
        date: string
    ) => {
        if (!date) {
            return "";
        }

        return new Date(
            date
        ).toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    /*
     * ==========================================
     * STATS
     * ==========================================
     */

    const statsData = [
        {
            label: "Total Reports",

            value:
                stats.total_reports,

            icon: (
                <Users
                    size={26}
                    className="text-blue-600"
                />
            ),

            bg: "bg-blue-50",
        },

        {
            label: "Active Users",

            value:
                stats.active_users,

            icon: (
                <UserCheck
                    size={26}
                    className="text-emerald-600"
                />
            ),

            bg: "bg-emerald-50",
        },

        {
            label: "Deactivated Users",

            value:
                stats.deactivated_users,

            icon: (
                <UserX
                    size={26}
                    className="text-red-600"
                />
            ),

            bg: "bg-red-50",
        },
    ];

    /*
     * ==========================================
     * TABLE COLUMNS
     * ==========================================
     */

    const columns = [
        {
            label: "Report ID",
            width: "120px",
        },

        {
            label: "Reported User",
            width: "280px",
        },

        {
            label: "Reported By",
            width: "220px",
        },

        {
            label: "Report Reason",
            width: "180px",
        },

        {
            label: "User Status",
            width: "150px",
        },

        {
            label: "Created At",
            width: "150px",
        },

        {
            label: "Action",
            width: "120px",
            className: "text-center",
        },
    ];

    /*
     * ==========================================
     * ACTIVATE / DEACTIVATE USER
     * ==========================================
     */

    const handleUserStatusChange = async (
        userId: number,
        isCurrentlyDeactivated: boolean
    ) => {
        try {
            await dispatch(
                changeUserStatus({
                    userId,
                    isDeactivated:
                        !isCurrentlyDeactivated,
                })
            ).unwrap();

            toast.success(
                isCurrentlyDeactivated
                    ? "User activated successfully"
                    : "User deactivated successfully"
            );

            dispatch(
                fetchUserReportStats()
            );
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update user status"
            );
        }
    };

    /*
     * ==========================================
     * DELETE USER REPORT
     * ==========================================
     */

    const handleDeleteReport = async () => {
        if (
            deleteReportId === null
        ) {
            return;
        }

        try {
            await dispatch(
                removeUserReport(
                    deleteReportId
                )
            ).unwrap();

            dispatch(
                fetchUserReportStats()
            );

            toast.success(
                "User report deleted successfully"
            );

            setDeleteReportId(null);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to delete user report"
            );
        }
    };

    /*
     * ==========================================
     * RENDER
     * ==========================================
     */

    return (
        <div className="px-5 py-5 md:px-6 lg:px-7">

            {/* ========================================
                HEADER
            ======================================== */}

            <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                    <h1 className="text-[28px] font-semibold text-[#101828]">
                        User Reports
                    </h1>

                    <p className="mt-1 text-[14px] text-[#667085]">
                        Review reports submitted against users and manage reported user accounts.
                    </p>
                </div>

                <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">

                    <div className="w-full lg:w-[305px]">

                        <Search
                            searchTerm={
                                searchInput
                            }
                            setSearchTerm={
                                handleSearchChange
                            }
                            placeholder="Search user reports..."
                        />

                    </div>

                    <select
                        value={
                            statusFilter
                        }
                        onChange={(
                            event
                        ) =>
                            handleStatusChange(
                                event.target.value
                            )
                        }
                        className="h-10 rounded-lg border border-[#D0D5DD] bg-white px-3 text-[13px] font-medium text-[#344054] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
                    >

                        <option value="">
                            All Status
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="deactivated">
                            Deactivated
                        </option>

                    </select>

                </div>

            </div>

            {/* ========================================
                STATS
            ======================================== */}

            <div className="mb-7">

                <StatsCards
                    stats={
                        statsData
                    }
                    cols={3}
                    loading={
                        statsLoading
                    }
                />

            </div>

            {/* ========================================
                TABLE
            ======================================== */}

            <div className="overflow-hidden rounded-[10px] border border-[#EAECF0] bg-white">

                <div className="w-full overflow-x-auto">

                    <table className="w-full min-w-[1250px] border-collapse text-left">

                        <TableHeader
                            columns={
                                columns
                            }
                            showCheckbox={
                                false
                            }
                        />

                        <tbody className="divide-y divide-[#EAECF0]">

                            {loading ? (

                                <TableSkeleton
                                    rows={
                                        rowsPerPage
                                    }
                                />

                            ) : reports.length ===
                                0 ? (

                                <tr>

                                    <td
                                        colSpan={
                                            7
                                        }
                                        className="px-6 py-16 text-center"
                                    >

                                        <div className="flex flex-col items-center justify-center">

                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF]">

                                                <FileWarning
                                                    size={
                                                        22
                                                    }
                                                    className="text-[#2563EB]"
                                                />

                                            </div>

                                            <p className="text-[15px] font-semibold text-[#101828]">
                                                No user reports found
                                            </p>

                                            <p className="mt-1 text-[13px] text-[#667085]">
                                                Try changing your search or filter.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                reports.map(
                                    (
                                        report
                                    ) => {

                                        const reported =
                                            report.reported;

                                        const reporter =
                                            report.reporter;

                                        const isDeactivated =
                                            reported?.is_deactivated ===
                                            true;

                                        const reportReason =
                                            report
                                                .Report_type
                                                ?.report_text ||
                                            report.report_text ||
                                            "N/A";

                                        return (

                                            <tr
                                                key={
                                                    report.report_id
                                                }
                                                className="transition-colors hover:bg-[#F9FAFB]"
                                            >

                                                {/* ========================================
                                                    REPORT ID
                                                ======================================== */}

                                                <td className="px-5 py-4">

                                                    <span className="text-[13px] font-semibold text-[#344054]">
                                                        #
                                                        {
                                                            report.report_id
                                                        }
                                                    </span>

                                                </td>

                                                {/* ========================================
                                                    REPORTED USER
                                                ======================================== */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-3">

                                                        {reported?.profile_pic ? (

                                                            <img
                                                                src={
                                                                    reported.profile_pic
                                                                }
                                                                alt={
                                                                    getUserName(
                                                                        reported
                                                                    )
                                                                }
                                                                className="h-10 w-10 shrink-0 rounded-full border border-gray-200 object-cover"
                                                            />

                                                        ) : (

                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D0D5DD] bg-[#EFF6FF] text-[12px] font-semibold text-[#2563EB]">

                                                                {getAvatarText(
                                                                    reported
                                                                )}

                                                            </div>

                                                        )}

                                                        <div className="min-w-0">

                                                            <p className="truncate text-[13px] font-semibold text-[#101828]">

                                                                {getUserName(
                                                                    reported
                                                                )}

                                                            </p>

                                                            <p className="mt-1 truncate text-[12px] text-[#667085]">

                                                                {getUsername(
                                                                    reported
                                                                )}

                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* ========================================
                                                    REPORTED BY
                                                ======================================== */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-3">

                                                        {reporter?.profile_pic ? (

                                                            <img
                                                                src={
                                                                    reporter.profile_pic
                                                                }
                                                                alt={
                                                                    getUserName(
                                                                        reporter
                                                                    )
                                                                }
                                                                className="h-10 w-10 shrink-0 rounded-full border border-gray-200 object-cover"
                                                            />

                                                        ) : (

                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D0D5DD] bg-[#EFF6FF] text-[12px] font-semibold text-[#2563EB]">

                                                                {getAvatarText(
                                                                    reporter
                                                                )}

                                                            </div>

                                                        )}

                                                        <div className="min-w-0">

                                                            <p className="truncate text-[13px] font-semibold text-[#101828]">

                                                                {getUserName(
                                                                    reporter
                                                                )}

                                                            </p>

                                                            <p className="mt-1 truncate text-[12px] text-[#667085]">

                                                                {getUsername(
                                                                    reporter
                                                                )}

                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* ========================================
                                                    REPORT REASON
                                                ======================================== */}

                                                <td className="px-5 py-4">

                                                    <Tags
                                                        text={
                                                            reportReason
                                                        }
                                                        variant="blue"
                                                    />

                                                </td>

                                                {/* ========================================
                                                    USER STATUS
                                                ======================================== */}

                                                <td className="px-5 py-4">

                                                    <TogglableSwitch
                                                        isActive={
                                                            !isDeactivated
                                                        }

                                                        onToggle={() =>
                                                            handleUserStatusChange(
                                                                reported.user_id,
                                                                isDeactivated
                                                            )
                                                        }

                                                        activeLabel="Active"

                                                        inactiveLabel="Deactivated"

                                                        loading={
                                                            statusLoadingUserId ===
                                                            reported?.user_id
                                                        }
                                                    />

                                                </td>

                                                {/* ========================================
                                                    CREATED AT
                                                ======================================== */}

                                                <td className="px-5 py-4">

                                                    <DateTime
                                                        date={formatDate(
                                                            report.createdAt
                                                        )}
                                                        time={formatTime(
                                                            report.createdAt
                                                        )}
                                                    />

                                                </td>

                                                {/* ========================================
                                                    ACTION
                                                ======================================== */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center justify-center gap-2">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                router.push(
                                                                    `/moderation/user-reports/view?report_id=${report.report_id}`
                                                                )
                                                            }
                                                            className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-[#2563EB]"
                                                            title="View Report"
                                                        >
                                                            <Eye size={17} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setDeleteReportId(
                                                                    report.report_id
                                                                )
                                                            }
                                                            disabled={
                                                                deleteReportLoadingId ===
                                                                report.report_id
                                                            }
                                                            className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                            title="Delete Report"
                                                        >

                                                            <Trash2
                                                                size={
                                                                    17
                                                                }
                                                            />

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );
                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* ========================================
                PAGINATION
            ======================================== */}

            {!loading &&
                pagination.total_pages >
                0 && (

                    <div className="mt-5 w-full">

                        <Pagination
                            currentPage={
                                pagination.current_page
                            }

                            totalPages={
                                pagination.total_pages
                            }

                            rowsPerPage={
                                pagination.records_per_page
                            }

                            onPageChange={
                                handlePageChange
                            }

                            onRowsPerPageChange={
                                handleRowsPerPageChange
                            }

                            rowsPerPageOptions={[
                                5,
                                10,
                                20,
                                50,
                            ]}

                            showRowsPerPage

                            showPageInfo
                        />

                    </div>

                )}

            {/* ========================================
                DELETE MODAL
            ======================================== */}

            {deleteReportId !==
                null && (

                    <UserDeleteModal
                        onClose={() =>
                            setDeleteReportId(
                                null
                            )
                        }

                        onConfirm={
                            handleDeleteReport
                        }

                        title="Delete User Report?"

                        message="Are you sure you want to permanently delete this user report? This action cannot be undone."

                        confirmText="Delete Report"

                        loading={
                            deleteReportLoading
                        }
                    />

                )}

        </div>
    );
};

export default UserReports;