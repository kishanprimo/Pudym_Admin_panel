"use client";

import { useEffect, useState } from "react";
import { Eye, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

import {
    fetchReactivationRequests,
} from "@/store/slices/AccountManagement/reactivationRequestsSlice";

import Search from "@/components/common/Search";
import TableHeader from "@/components/common/TableHeader";
import Pagination from "@/components/common/Pagination";
import Tags from "@/components/common/Tags";
import DateTime from "@/components/common/DateTime";
import TableSkeleton from "@/components/common/TableSkeleton";

const ReactivationRequests = () => {
    const router = useRouter();

    const dispatch = useAppDispatch();

    const {
        requests,
        pagination,
        loading,
    } = useAppSelector(
        (state) =>
            state.reactivationRequests
    );

    const [searchInput, setSearchInput] =
        useState("");

    const [searchTerm, setSearchTerm] =
        useState("");

    const [currentPage, setCurrentPage] =
        useState(1);

    const [rowsPerPage, setRowsPerPage] =
        useState(10);

    /*
     * ==========================================
     * FETCH REQUESTS
     * ==========================================
     */

    useEffect(() => {
        dispatch(
            fetchReactivationRequests({
                page: currentPage,
                limit: rowsPerPage,
            })
        );
    }, [
        dispatch,
        currentPage,
        rowsPerPage,
    ]);

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
            setSearchTerm(
                searchInput
            );

            setCurrentPage(1);
        }, 500);

        return () =>
            clearTimeout(timer);
    }, [searchInput]);

    /*
     * ==========================================
     * HELPERS
     * ==========================================
     */

    const getAvatarText = (
        fullName: string
    ) => {
        const words =
            fullName
                ?.trim()
                .split(/\s+/)
                .filter(Boolean);

        if (
            words &&
            words.length >= 2
        ) {
            return `${words[0][0]}${words[1][0]}`
                .toUpperCase();
        }

        return (
            words?.[0]
                ?.slice(0, 2)
                .toUpperCase() ||
            "U"
        );
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
     * STATUS
     * ==========================================
     */

    const getStatusVariant = (
        status: string
    ) => {
        switch (status) {
            case "approved":
                return "green";

            case "rejected":
                return "red";

            case "pending":
            default:
                return "orange";
        }
    };

    const getStatusLabel = (
        status: string
    ) => {
        switch (status) {
            case "approved":
                return "Approved";

            case "rejected":
                return "Rejected";

            case "pending":
            default:
                return "Pending";
        }
    };

    /*
     * ==========================================
     * TABLE COLUMNS
     * ==========================================
     */

    const columns = [
        {
            label: "User",
            width: "250px",
        },

        {
            label: "Email",
            width: "240px",
        },

        {
            label: "Role",
            width: "120px",
        },

        {
            label: "Request Note",
            width: "350px",
        },

        {
            label: "Status",
            width: "140px",
        },

        {
            label: "Requested At",
            width: "150px",
        },

        {
            label: "Action",
            width: "100px",
            className: "text-center",
        },
    ];

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
     * CLIENT-SIDE SEARCH
     * ==========================================
     *
     * Current API response does not provide
     * search parameters, so we search the
     * records returned by the current page.
     *
     */

    const filteredRequests =
        requests.filter(
            (request) => {
                if (!searchTerm.trim()) {
                    return true;
                }

                const search =
                    searchTerm
                        .toLowerCase()
                        .trim();

                return (
                    request.full_name
                        ?.toLowerCase()
                        .includes(search) ||

                    request.user_name
                        ?.toLowerCase()
                        .includes(search) ||

                    request.email
                        ?.toLowerCase()
                        .includes(search) ||

                    request.request_note
                        ?.toLowerCase()
                        .includes(search) ||

                    request.status
                        ?.toLowerCase()
                        .includes(search)
                );
            }
        );

    return (
        <div className="px-5 py-5 md:px-6 lg:px-7">

            {/* ========================================
                HEADER
            ======================================== */}

            <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                    <h1 className="text-[28px] font-semibold text-[#101828]">
                        Reactivation Requests
                    </h1>

                    <p className="mt-1 text-[14px] text-[#667085]">
                        Manage account reactivation requests.
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
                            placeholder="Search reactivation requests..."
                        />
                    </div>

                </div>
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
                            ) : filteredRequests.length ===
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
                                                <RotateCcw
                                                    size={
                                                        22
                                                    }
                                                    className="text-[#2563EB]"
                                                />
                                            </div>

                                            <p className="text-[15px] font-semibold text-[#101828]">
                                                No reactivation requests found
                                            </p>

                                            <p className="mt-1 text-[13px] text-[#667085]">
                                                Try changing your search.
                                            </p>

                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map(
                                    (
                                        request
                                    ) => (
                                        <tr
                                            key={
                                                request.request_id
                                            }
                                            className="transition-colors hover:bg-[#F9FAFB]"
                                        >

                                            {/* USER */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D0D5DD] bg-[#EFF6FF] text-[12px] font-semibold text-[#2563EB]">
                                                        {getAvatarText(
                                                            request.full_name
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">

                                                        <p className="truncate text-[13px] font-semibold text-[#101828]">
                                                            {
                                                                request.full_name
                                                            }
                                                        </p>

                                                        <p className="mt-1 truncate text-[12px] text-[#667085]">
                                                            @{request.user_name}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* EMAIL */}

                                            <td className="px-5 py-4">

                                                <p className="truncate text-[13px] text-[#475467]">
                                                    {
                                                        request.email
                                                    }
                                                </p>

                                            </td>

                                            {/* ROLE */}

                                            <td className="px-5 py-4">

                                                <Tags
                                                    text={
                                                        request.role
                                                    }
                                                    variant="blue"
                                                />

                                            </td>

                                            {/* REQUEST NOTE */}

                                            <td className="px-5 py-4">

                                                <p
                                                    className="max-w-[320px] truncate text-[13px] text-[#475467]"
                                                    title={
                                                        request.request_note
                                                    }
                                                >
                                                    {
                                                        request.request_note
                                                    }
                                                </p>

                                            </td>

                                            {/* STATUS */}

                                            <td className="px-5 py-4">

                                                <Tags
                                                    text={
                                                        getStatusLabel(
                                                            request.status
                                                        )
                                                    }
                                                    variant={
                                                        getStatusVariant(
                                                            request.status
                                                        ) as any
                                                    }
                                                />

                                            </td>

                                            {/* REQUESTED AT */}

                                            <td className="px-5 py-4">

                                                <DateTime
                                                    date={formatDate(
                                                        request.createdAt
                                                    )}
                                                    time={formatTime(
                                                        request.createdAt
                                                    )}
                                                />

                                            </td>

                                            {/* ACTION */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center justify-center">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            router.push(
                                                                `/AccountManagement/reactivation-requests/view?request_id=${request.request_id}`
                                                            )
                                                        }
                                                        className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-[#2563EB]"
                                                        title="View Request"
                                                    >
                                                        <Eye
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    )
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
                pagination.totalPages >
                0 && (
                    <div className="mt-5 w-full">

                        <Pagination
                            currentPage={
                                pagination.page
                            }
                            totalPages={
                                pagination.totalPages
                            }
                            rowsPerPage={
                                pagination.limit
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

        </div>
    );
};

export default ReactivationRequests;