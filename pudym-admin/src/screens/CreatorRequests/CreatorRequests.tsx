"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    FileCheck,
    Clock3,
    AlertCircle,
    CheckCircle2,
    XCircle,
    MapPin,
} from "lucide-react";


import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

import {
    fetchCreatorRequests,
    fetchCreatorRequestStats,
} from "@/store/slices/CreatorRequestsSlices/creatorRequestsSlice";
import type {
    CreatorRequestListItem,
} from "@/types/CreatorRequestsTypes/getCreatorRequests.types";
import StatsCards from "@/components/common/StatsCard";
import Search from "@/components/common/Search";
import TableHeader from "@/components/common/TableHeader";
import Pagination from "@/components/common/Pagination";
import Action from "@/components/common/Action";
import Tags from "@/components/common/Tags";
import DateTime from "@/components/common/DateTime";
import TableSkeleton from "@/components/common/TableSkeleton";


const CreatorRequests = () => {

    const router = useRouter();

    const dispatch = useAppDispatch();

    const {
        requests,
        pagination,
        stats,
        loading,
        statsLoading,
    } = useAppSelector(
        (state) => state.creatorRequests
    );


    const [
        searchInput,
        setSearchInput,
    ] = useState("");

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const [
        currentPage,
        setCurrentPage,
    ] = useState(1);

    const [
        rowsPerPage,
        setRowsPerPage,
    ] = useState(10);


    /**
     * ==========================================
     * FETCH REQUESTS
     * ==========================================
     */

    useEffect(() => {

        dispatch(
            fetchCreatorRequests({
                page: currentPage,

                pageSize: rowsPerPage,

                search: searchTerm,
            })
        );

    }, [
        dispatch,
        currentPage,
        rowsPerPage,
        searchTerm,
    ]);


    /**
     * ==========================================
     * FETCH STATS
     * ==========================================
     */

    useEffect(() => {

        dispatch(
            fetchCreatorRequestStats()
        );

    }, [dispatch]);


    /**
     * ==========================================
     * SEARCH
     * ==========================================
     */

    useEffect(() => {

        const timer =
            setTimeout(() => {

                setSearchTerm(
                    searchInput
                );

                setCurrentPage(1);

            }, 1000);

        return () =>
            clearTimeout(timer);

    }, [searchInput]);


    /**
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


    /**
     * ==========================================
     * VIEW
     * ==========================================
     */

    const handleView = (
        userId: number
    ) => {

        router.push(
            `/creator-requests/view?user_id=${userId}`
        );
    };


    /**
     * ==========================================
     * FORMATTERS
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


    const formatLocation = (
        city: string | null,
        state: string | null,
        country: string | null
    ) => {

        const parts = [
            city,
            state,
            country,
        ].filter(Boolean);

        return parts.length
            ? parts.join(", ")
            : "N/A";
    };


    const getAvatarText = (
        request: CreatorRequestListItem
    ) => {

        const name =
            request.full_name ||
            `${request.first_name || ""} ${request.last_name || ""
                }`.trim() ||
            "Creator";


        const words =
            name
                .trim()
                .split(/\s+/)
                .filter(Boolean);


        if (words.length >= 2) {

            return (
                `${words[0][0]}${words[1][0]}`
            ).toUpperCase();
        }


        return words[0]
            ?.slice(0, 2)
            .toUpperCase() || "CR";
    };


    /**
     * ==========================================
     * STATUS
     * ==========================================
     */

    const getStatusTag = (
        status: string
    ) => {
        switch (status) {
            case "under_review":
                return (
                    <Tags
                        text="Under Review"
                        variant="blue"
                    />
                );

            case "pending":
                return (
                    <Tags
                        text="Pending"
                        variant="orange"
                    />
                );

            case "approved":
                return (
                    <Tags
                        text="Approved"
                        variant="emerald"
                    />
                );

            case "rejected":
                return (
                    <Tags
                        text="Rejected"
                        variant="red"
                    />
                );

            default:
                return (
                    <Tags
                        text="N/A"
                        variant="gray"
                    />
                );
        }
    };


    /**
     * ==========================================
     * STATS
     * ==========================================
     */

    const statsData = [

        {
            label: "Total Requests",

            value:
                stats.total_requests,

            icon: (
                <FileCheck
                    size={26}
                    className="text-blue-600"
                />
            ),

            bg: "bg-blue-50",
        },


        {
            label: "Under Review",

            value:
                stats.under_review,

            icon: (
                <Clock3
                    size={26}
                    className="text-indigo-600"
                />
            ),

            bg: "bg-indigo-50",
        },


        {
            label: "Pending",

            value:
                stats.pending,

            icon: (
                <AlertCircle
                    size={26}
                    className="text-orange-600"
                />
            ),

            bg: "bg-orange-50",
        },


        {
            label: "Approved",

            value:
                stats.approved,

            icon: (
                <CheckCircle2
                    size={26}
                    className="text-emerald-600"
                />
            ),

            bg: "bg-emerald-50",
        },


        {
            label: "Rejected",

            value:
                stats.rejected,

            icon: (
                <XCircle
                    size={26}
                    className="text-red-600"
                />
            ),

            bg: "bg-red-50",
        },
    ];


    /**
     * ==========================================
     * TABLE COLUMNS
     * ==========================================
     */

    const columns = [

        {
            label: "Image",
            width: "90px",
        },

        {
            label: "Creator",
            width: "190px",
        },

        {
            label: "Email",
            width: "220px",
        },

        {
            label: "Location",
            width: "200px",
        },

        {
            label: "Purpose",
            width: "280px",
        },

        {
            label: "Status",
            width: "150px",
        },

        {
            label: "Submitted At",
            width: "150px",
        },

        {
            label: "Action",
            width: "100px",
            className: "text-center",
        },
    ];


    return (
        <div className="px-5 py-5 md:px-6 lg:px-7">

            {/* HEADER */}

            <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <h1 className="text-[28px] font-semibold text-[#101828]">
                        Creator Requests
                    </h1>

                    <p className="mt-1 text-[14px] text-[#667085]">
                        Review and manage professional creator applications.
                    </p>

                </div>


                <div className="w-full lg:w-[305px]">

                    <Search
                        searchTerm={searchInput}
                        setSearchTerm={setSearchInput}
                        placeholder="Search creators by Name..."
                    />

                </div>

            </div>


            {/* STATS */}

            <div className="mb-7">

                <StatsCards
                    stats={statsData}
                    cols={5}
                    loading={statsLoading}
                />

            </div>


            {/* TABLE */}

            <div className="overflow-hidden rounded-[10px] border border-[#EAECF0] bg-white">

                <div className="w-full overflow-x-auto">

                    <table className="w-full min-w-[1400px] text-left border-collapse">

                        <TableHeader
                            columns={columns}
                            showCheckbox={false}
                        />


                        <tbody className="divide-y divide-[#EAECF0]">

                            {loading ? (

                                <TableSkeleton
                                    rows={rowsPerPage}
                                />

                            ) : requests.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={8}
                                        className="px-6 py-16 text-center"
                                    >

                                        <div className="flex flex-col items-center justify-center">

                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF]">

                                                <FileCheck
                                                    size={22}
                                                    className="text-[#2563EB]"
                                                />

                                            </div>

                                            <p className="text-[15px] font-semibold text-[#101828]">
                                                No creator requests found
                                            </p>

                                            <p className="mt-1 text-[13px] text-[#667085]">
                                                Try changing your search.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                requests.map(
                                    (request) => {

                                        const location =
                                            formatLocation(
                                                request.city,
                                                request.state,
                                                request.country
                                            );


                                        return (

                                            <tr
                                                key={
                                                    request.user_id
                                                }
                                                className="transition-colors hover:bg-[#F9FAFB]"
                                            >

                                                {/* IMAGE */}

                                                <td className="px-5 py-4">

                                                    {request.profile_pic ? (

                                                        <img
                                                            src={
                                                                request.profile_pic
                                                            }
                                                            alt={
                                                                request.full_name ||
                                                                "Creator"
                                                            }
                                                            className="h-11 w-11 rounded-full border border-gray-200 object-cover"
                                                        />

                                                    ) : (

                                                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D0D5DD] bg-[#EFF6FF] text-[13px] font-semibold text-[#2563EB]">

                                                            {getAvatarText(
                                                                request
                                                            )}

                                                        </div>

                                                    )}

                                                </td>


                                                {/* CREATOR */}

                                                <td className="px-5 py-4">

                                                    <div className="min-w-0">

                                                        <p className="truncate text-[14px] font-semibold text-[#101828]">

                                                            {request.full_name ||
                                                                `${request.first_name || ""} ${request.last_name || ""
                                                                    }`.trim() ||
                                                                "Unknown"}

                                                        </p>

                                                        <p className="mt-1 truncate text-[12px] text-[#667085]">

                                                            {request.user_name
                                                                ? `@${request.user_name.replace(
                                                                    /^@/,
                                                                    ""
                                                                )}`
                                                                : "N/A"}

                                                        </p>

                                                    </div>

                                                </td>


                                                {/* EMAIL */}

                                                <td className="px-5 py-4">

                                                    <p className="max-w-[220px] truncate text-[13px] text-[#475467]">

                                                        {request.email ||
                                                            "N/A"}

                                                    </p>

                                                </td>


                                                {/* LOCATION */}

                                                <td className="px-5 py-4">

                                                    <div className="flex max-w-[200px] items-start gap-2">

                                                        <MapPin
                                                            size={14}
                                                            className="mt-0.5 shrink-0 text-[#98A2B3]"
                                                        />

                                                        <p
                                                            className="text-[13px] leading-5 text-[#475467]"
                                                            title={
                                                                location
                                                            }
                                                        >

                                                            {location}

                                                        </p>

                                                    </div>

                                                </td>


                                                {/* PURPOSE */}

                                                <td className="px-5 py-4">

                                                    <p
                                                        className="max-w-[280px] truncate text-[13px] text-[#475467]"
                                                        title={
                                                            request.purpose_description
                                                        }
                                                    >

                                                        {request.purpose_description ||
                                                            "N/A"}

                                                    </p>

                                                </td>


                                                {/* STATUS */}

                                                <td className="px-5 py-4">

                                                    {getStatusTag(
                                                        request.status
                                                    )}

                                                </td>


                                                {/* DATE */}

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

                                                    <Action
                                                        showView
                                                        showEdit={false}
                                                        showDelete={false}
                                                        onView={() =>
                                                            handleView(
                                                                request.user_id
                                                            )
                                                        }
                                                    />

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


            {/* PAGINATION */}

            {!loading &&
                pagination.total_pages > 0 && (

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

        </div>
    );
};


export default CreatorRequests;