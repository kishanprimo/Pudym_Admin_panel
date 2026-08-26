"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    FileWarning,
    Eye,
    EyeOff,
    Trash2,
    Download,
    ChevronDown,
    MapPin,
    Users,
} from "lucide-react";

import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

import {
    fetchContentReports,
    fetchContentReportStats,
    changeContentStatus,
    removeContentReport,
    removeReportedContent,
} from "@/store/slices/ModerationSlices/contentReportsSlice";
import { useRouter } from "next/navigation";
import StatsCards from "@/components/common/StatsCard";
import Search from "@/components/common/Search";
import TableHeader from "@/components/common/TableHeader";
import Pagination from "@/components/common/Pagination";
import Tags from "@/components/common/Tags";
import DateTime from "@/components/common/DateTime";
import TableSkeleton from "@/components/common/TableSkeleton";
import TogglableSwitch from "@/components/common/TogglableSwitch";
import UserDeleteModal from "@/components/common/UserDeleteModal";

const ContentReports = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const {
        reports,
        pagination,
        stats,
        loading,
        statsLoading,
        statusLoadingSocialId,
        deleteReportLoading,
        deleteReportLoadingId,
    } = useAppSelector(
        (state) => state.contentReports
    );
    const [searchInput, setSearchInput] =
        useState("");

    const [searchTerm, setSearchTerm] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("");

    const [exportOpen, setExportOpen] =
        useState(false);

    const [currentPage, setCurrentPage] =
        useState(1);

    const [rowsPerPage, setRowsPerPage] =
        useState(10);

    const [deleteReportId, setDeleteReportId] =
        useState<number | null>(null);
    /*
     * ==========================================
     * FETCH REPORTS
     * ==========================================
     */

    useEffect(() => {
        dispatch(
            fetchContentReports({
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
     * FETCH STATS
     * ==========================================
     */

    useEffect(() => {
        dispatch(
            fetchContentReportStats()
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
     * FORMATTERS
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

        return words[0]
            ?.slice(0, 2)
            .toUpperCase() || "U";
    };

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
                <FileWarning
                    size={26}
                    className="text-blue-600"
                />
            ),

            bg: "bg-blue-50",
        },

        {
            label: "Active Content",

            value:
                stats.active_content,

            icon: (
                <Eye
                    size={26}
                    className="text-emerald-600"
                />
            ),

            bg: "bg-emerald-50",
        },

        {
            label: "Hidden Content",

            value:
                stats.hidden_content,

            icon: (
                <EyeOff
                    size={26}
                    className="text-orange-600"
                />
            ),

            bg: "bg-orange-50",
        },

        {
            label: "Removed Content",

            value:
                stats.removed_content,

            icon: (
                <Trash2
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
            label: "Content",
            width: "280px",
        },

        {
            label: "Reported By",
            width: "220px",
        },

        {
            label: "Content Owner",
            width: "220px",
        },

        {
            label: "Report Reason",
            width: "180px",
        },

        {
            label: "Content Status",
            width: "150px",
        },

        {
            label: "Created At",
            width: "150px",
        },

        {
            label: "Action",
            width: "120px",
            className:
                "text-center",
        },
    ];

    /*
     * ==========================================
     * EXPORT
     * ==========================================
     */

    const handleExport = () => {
        if (!reports.length) {
            toast.info(
                "No content reports available to export"
            );

            return;
        }

        const headers = [
            "Report ID",
            "Content",
            "Reported By",
            "Content Owner",
            "Report Reason",
            "Status",
            "Created At",
        ];

        const rows =
            reports.map(
                (report) => {
                    const content =
                        report.Social
                            ?.social_desc ||
                        "N/A";

                    const reportedBy =
                        getUserName(
                            report.User
                        );

                    const owner =
                        getUserName(
                            report.Social
                                ?.User
                        );

                    const reason =
                        report.Report_type
                            ?.report_text ||
                        report.report_text ||
                        "N/A";

                    const status =
                        report.Social?.removed_by_admin
                            ? "Removed"
                            : report.Social?.status
                                ? "Active"
                                : "Hidden";

                    return [
                        report.report_id,
                        content,
                        reportedBy,
                        owner,
                        reason,
                        status,
                        report.createdAt ||
                        "N/A",
                    ];
                }
            );

        const csvContent = [
            headers.join(","),
            ...rows.map(
                (row) =>
                    row
                        .map(
                            (value) =>
                                `"${String(
                                    value
                                ).replace(
                                    /"/g,
                                    '""'
                                )}"`
                        )
                        .join(",")
            ),
        ].join("\n");

        const blob =
            new Blob(
                [csvContent],
                {
                    type: "text/csv;charset=utf-8;",
                }
            );

        const url =
            URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href = url;

        link.download =
            "content-reports.csv";

        document.body.appendChild(
            link
        );

        link.click();

        document.body.removeChild(
            link
        );

        URL.revokeObjectURL(
            url
        );

        toast.success(
            "Content reports exported successfully"
        );
    };
    const handleContentStatusChange = async (
        socialId: number,
        currentStatus: boolean
    ) => {
        try {
            await dispatch(
                changeContentStatus({
                    socialId,
                    status: !currentStatus,
                })
            ).unwrap();

            dispatch(
                fetchContentReportStats()
            );
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update content status"
            );
        }
    };
    const handleDeleteReport = async () => {
        if (deleteReportId === null) {
            return;
        }

        try {
            await dispatch(
                removeContentReport(deleteReportId)
            ).unwrap();

            dispatch(
                fetchContentReportStats()
            );

            toast.success(
                "Content report deleted successfully"
            );

            setDeleteReportId(null);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to delete content report"
            );
        }
    };
    return (
        <div className="px-5 py-5 md:px-6 lg:px-7">

            {/* ========================================
                HEADER
            ======================================== */}

            <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                    <h1 className="text-[28px] font-semibold text-[#101828]">
                        Content Reports
                    </h1>

                    <p className="mt-1 text-[14px] text-[#667085]">
                        Manage and monitor reported content.
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
                            placeholder="Search content reports..."
                        />
                    </div>

                </div>
            </div>

            {/* ========================================
                STATS
            ======================================== */}

            <div className="mb-7">
                <StatsCards
                    stats={statsData}
                    cols={4}
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
                                                No content reports found
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

                                        const social =
                                            report.Social;

                                        const reporter =
                                            report.User;

                                        const owner =
                                            social?.User;

                                        const reason =
                                            report
                                                .Report_type
                                                ?.report_text ||
                                            report.report_text ||
                                            "N/A";

                                        const isRemoved =
                                            social?.removed_by_admin === true;

                                        const isActive =
                                            social?.status === true &&
                                            !isRemoved;

                                        return (
                                            <tr
                                                key={
                                                    report.report_id
                                                }
                                                className="transition-colors hover:bg-[#F9FAFB]"
                                            >

                                                {/* CONTENT */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-3">

                                                        {social?.reel_thumbnail ? (
                                                            <img
                                                                src={
                                                                    social.reel_thumbnail
                                                                }
                                                                alt="Content"
                                                                className="h-11 w-11 shrink-0 rounded-lg border border-gray-200 object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#D0D5DD] bg-[#EFF6FF]">
                                                                <FileWarning
                                                                    size={
                                                                        18
                                                                    }
                                                                    className="text-[#2563EB]"
                                                                />
                                                            </div>
                                                        )}

                                                        <div className="min-w-0">

                                                            <p
                                                                className="max-w-[210px] truncate text-[14px] font-semibold text-[#101828]"
                                                                title={
                                                                    social?.social_desc ||
                                                                    ""
                                                                }
                                                            >
                                                                {social?.social_desc ||
                                                                    "N/A"}
                                                            </p>

                                                            <p className="mt-1 text-[12px] text-[#667085]">
                                                                {social?.social_type ||
                                                                    "N/A"}
                                                            </p>

                                                            {isRemoved && (
                                                                <div className="mt-1.5">
                                                                    <Tags
                                                                        text="Content Removed"
                                                                        variant="red"
                                                                    />
                                                                </div>
                                                            )}

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* REPORTED BY */}

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

                                                {/* CONTENT OWNER */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-3">

                                                        {owner?.profile_pic ? (
                                                            <img
                                                                src={
                                                                    owner.profile_pic
                                                                }
                                                                alt={
                                                                    getUserName(
                                                                        owner
                                                                    )
                                                                }
                                                                className="h-10 w-10 shrink-0 rounded-full border border-gray-200 object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D0D5DD] bg-[#EFF6FF] text-[12px] font-semibold text-[#2563EB]">
                                                                {getAvatarText(
                                                                    owner
                                                                )}
                                                            </div>
                                                        )}

                                                        <div className="min-w-0">

                                                            <p className="truncate text-[13px] font-semibold text-[#101828]">
                                                                {getUserName(
                                                                    owner
                                                                )}
                                                            </p>

                                                            <p className="mt-1 truncate text-[12px] text-[#667085]">
                                                                {getUsername(
                                                                    owner
                                                                )}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* REPORT REASON */}

                                                <td className="px-5 py-4">

                                                    <Tags
                                                        text={
                                                            reason
                                                        }
                                                        variant="blue"
                                                    />

                                                </td>

                                                {/* STATUS */}

                                                <td className="px-5 py-4">

                                                    <TogglableSwitch
                                                        isActive={isActive}
                                                        onToggle={() =>
                                                            handleContentStatusChange(
                                                                social.social_id,
                                                                isActive
                                                            )
                                                        }
                                                        activeLabel="Active"
                                                        inactiveLabel="Hidden"

                                                        disabled={isRemoved}

                                                        disabledLabel="Removed"

                                                        disabledClassName="bg-red-50 text-red-600"

                                                        loading={
                                                            !isRemoved &&
                                                            statusLoadingSocialId ===
                                                            social.social_id
                                                        }
                                                    />
                                                </td>
                                                {/* CREATED AT */}

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

                                                {/* ACTION */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center justify-center gap-2">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                router.push(
                                                                    `/moderation/content-reports/view?report_id=${report.report_id}`
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
                                                            <Trash2 size={17} />
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
            {deleteReportId !== null && (
                <UserDeleteModal
                    onClose={() =>
                        setDeleteReportId(null)
                    }
                    onConfirm={
                        handleDeleteReport
                    }
                    title="Delete Content Report?"
                    message="Are you sure you want to permanently delete this content report? This action cannot be undone."
                    confirmText="Delete Report"
                    loading={
                        deleteReportLoading
                    }
                />
            )}
        </div>
    );
};

export default ContentReports;