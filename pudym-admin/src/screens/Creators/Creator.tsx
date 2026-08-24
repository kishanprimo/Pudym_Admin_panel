"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Users,
    UserCheck,
    UserX,
    MapPin,
} from "lucide-react";

import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

import {
    fetchCreators,
    fetchCreatorStats,
    changeCreatorStatus,
} from "@/store/slices/CreatorsSlices/creatorsSlice";

import type {
    CreatorListItem,
} from "@/types/CreatorsTypes/getCreators.types";

import StatsCards from "@/components/common/StatsCard";
import Search from "@/components/common/Search";
import TableHeader from "@/components/common/TableHeader";
import Pagination from "@/components/common/Pagination";
import Action from "@/components/common/Action";
import TogglableSwitch from "@/components/common/TogglableSwitch";
import DateTime from "@/components/common/DateTime";
import TableSkeleton from "@/components/common/TableSkeleton";


const Creator = () => {

    const router = useRouter();

    const dispatch = useAppDispatch();

    const {
        creators,
        pagination,
        stats,
        loading,
        statsLoading,
        statusLoading,
        statusLoadingUserId,
    } = useAppSelector(
        (state) => state.creators
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


    /*
     * ==========================================
     * FETCH CREATORS
     * ==========================================
     */

    useEffect(() => {

        dispatch(
            fetchCreators({
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


    /*
     * ==========================================
     * FETCH CREATOR STATS
     * ==========================================
     */

    useEffect(() => {

        dispatch(
            fetchCreatorStats()
        );

    }, [dispatch]);


    /*
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
     * VIEW CREATOR
     * ==========================================
     */

    const handleView = (
        userId: number
    ) => {

        router.push(
            `/creators/view?user_id=${userId}`
        );
    };

    /*
     * ==========================================
     * CREATOR STATUS TOGGLE
     * ==========================================
     */

    const handleCreatorStatusToggle = async (
        userId: number,
        currentIsDeactivated: boolean
    ) => {

        await dispatch(
            changeCreatorStatus({
                userId,
                is_deactivated: !currentIsDeactivated,
            })
        );
    };
    /*
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

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "N/A";
        }

        return parsedDate.toLocaleDateString(
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

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "";
        }

        return parsedDate.toLocaleTimeString(
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


    const formatCoins = (
        coins: string | number
    ) => {

        if (
            coins === null ||
            coins === undefined ||
            coins === ""
        ) {
            return "0";
        }

        return Number(coins).toLocaleString(
            "en-IN"
        );
    };


    /*
     * ==========================================
     * AVATAR
     * ==========================================
     */

    const getAvatarText = (
        creator: CreatorListItem
    ) => {

        const name =
            creator.full_name ||
            `${creator.first_name || ""} ${creator.last_name || ""}`.trim() ||
            "Creator";

        const words =
            name
                .trim()
                .split(/\s+/)
                .filter(Boolean);

        if (
            words.length >= 2
        ) {

            return (
                `${words[0][0]}${words[1][0]}`
            ).toUpperCase();
        }

        return (
            words[0]
                ?.slice(0, 2)
                .toUpperCase() ||
            "CR"
        );
    };




    /*
     * ==========================================
     * STATS
     * ==========================================
     */

    const statsData = [

        {
            label: "Total Creators",

            value:
                stats.total_creators,

            icon: (
                <Users
                    size={26}
                    className="text-blue-600"
                />
            ),

            bg: "bg-blue-50",
        },


        {
            label: "Active Creators",

            value:
                stats.active_creators,

            icon: (
                <UserCheck
                    size={26}
                    className="text-emerald-600"
                />
            ),

            bg: "bg-emerald-50",
        },


        {
            label: "Deactivated Creators",

            value:
                stats.deactivated_creators,

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
            label: "Image",
            width: "70px",
        },
        {
            label: "Creator",
            width: "170px",
        },
        {
            label: "Email",
            width: "190px",
        },
        {
            label: "Mobile",
            width: "135px",
        },
        {
            label: "Location",
            width: "180px",
        },
        {
            label: "Socials",
            width: "70px",
        },
        {
            label: "Coins",
            width: "90px",
        },
        {
            label: "Status",
            width: "175px",
        },
        {
            label: "Created At",
            width: "115px",
        },
        {
            label: "Action",
            width: "70px",
            className: "text-center",
        },
    ];


    return (
        <div className="px-5 py-5 md:px-6 lg:px-7">

            {/* ========================================
                HEADER
            ======================================== */}

            <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <h1 className="text-[28px] font-semibold text-[#101828]">
                        Creators
                    </h1>

                    <p className="mt-1 text-[14px] text-[#667085]">
                        Manage approved creators and their account status.
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


            {/* ========================================
                STATS
            ======================================== */}

            <div className="mb-7">

                <StatsCards
                    stats={statsData}
                    cols={3}
                    loading={statsLoading}
                />

            </div>


            {/* ========================================
                TABLE
            ======================================== */}

            <div className="overflow-hidden rounded-[10px] border border-[#EAECF0] bg-white">

                <div className="w-full overflow-hidden">

                    <table className="w-full table-fixed border-collapse text-left">

                        <TableHeader
                            columns={columns}
                            showCheckbox={false}
                        />


                        <tbody className="divide-y divide-[#EAECF0]">

                            {loading ? (

                                <TableSkeleton
                                    rows={rowsPerPage}
                                />

                            ) : creators.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={10}
                                        className="px-6 py-16 text-center"
                                    >

                                        <div className="flex flex-col items-center justify-center">

                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF]">

                                                <Users
                                                    size={22}
                                                    className="text-[#2563EB]"
                                                />

                                            </div>

                                            <p className="text-[15px] font-semibold text-[#101828]">
                                                No creators found
                                            </p>

                                            <p className="mt-1 text-[13px] text-[#667085]">
                                                Try changing your search.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                creators.map(
                                    (creator) => {

                                        const location =
                                            formatLocation(
                                                creator.city,
                                                creator.state,
                                                creator.country
                                            );


                                        return (

                                            <tr
                                                key={
                                                    creator.user_id
                                                }
                                                className="transition-colors hover:bg-[#F9FAFB]"
                                            >

                                                {/* IMAGE */}

                                                <td className="px-5 py-4">

                                                    {creator.profile_pic ? (

                                                        <img
                                                            src={
                                                                creator.profile_pic
                                                            }
                                                            alt={
                                                                creator.full_name ||
                                                                "Creator"
                                                            }
                                                            className="h-11 w-11 rounded-full border border-gray-200 object-cover"
                                                        />

                                                    ) : (

                                                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D0D5DD] bg-[#EFF6FF] text-[13px] font-semibold text-[#2563EB]">

                                                            {getAvatarText(
                                                                creator
                                                            )}

                                                        </div>

                                                    )}

                                                </td>


                                                {/* CREATOR */}

                                                <td className="px-5 py-4">

                                                    <div className="min-w-0">

                                                        <p className="truncate text-[14px] font-semibold text-[#101828]">

                                                            {creator.full_name ||
                                                                `${creator.first_name || ""} ${creator.last_name || ""}`.trim() ||
                                                                "Unknown"}

                                                        </p>

                                                        <p className="mt-1 truncate text-[12px] text-[#667085]">

                                                            {creator.user_name
                                                                ? `@${creator.user_name.replace(
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

                                                        {creator.email ||
                                                            "N/A"}

                                                    </p>

                                                </td>


                                                {/* MOBILE */}

                                                <td className="px-5 py-4">

                                                    <p className="text-[13px] text-[#475467]">

                                                        {creator.mobile_num
                                                            ? `${creator.country_code || ""} ${creator.mobile_num}`.trim()
                                                            : "N/A"}

                                                    </p>

                                                </td>


                                                {/* LOCATION */}

                                                <td className="px-5 py-4">

                                                    <div className="flex max-w-[220px] items-start gap-2">

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


                                                {/* SOCIALS */}

                                                <td className="px-5 py-4">

                                                    <p className="text-[13px] font-medium text-[#344054]">

                                                        {creator.total_socials ??
                                                            0}

                                                    </p>

                                                </td>


                                                {/* COINS */}

                                                <td className="px-5 py-4">

                                                    <p className="text-[13px] font-medium text-[#344054]">

                                                        {formatCoins(
                                                            creator.available_coins
                                                        )}

                                                    </p>

                                                </td>


                                                {/* STATUS */}

                                                <td className="px-3 py-4">

                                                    <TogglableSwitch
                                                        isActive={!creator.is_deactivated}
                                                        onToggle={() =>
                                                            handleCreatorStatusToggle(
                                                                creator.user_id,
                                                                creator.is_deactivated
                                                            )
                                                        }
                                                        disabled={
                                                            statusLoading &&
                                                            statusLoadingUserId === creator.user_id
                                                        }
                                                        activeLabel="Active"
                                                        inactiveLabel="Deactivated"
                                                        showLabel
                                                    />

                                                </td>


                                                {/* CREATED AT */}

                                                <td className="px-5 py-4">

                                                    <DateTime
                                                        date={formatDate(
                                                            creator.createdAt
                                                        )}
                                                        time={formatTime(
                                                            creator.createdAt
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
                                                                creator.user_id
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


            {/* ========================================
                PAGINATION
            ======================================== */}

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


export default Creator;