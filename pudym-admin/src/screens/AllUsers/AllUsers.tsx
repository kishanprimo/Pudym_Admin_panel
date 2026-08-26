"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    Users,
    UserCheck,
    UserX,
    ShieldAlert,
    MapPin,
    Loader2,
    Download,
    ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
    fetchAllUsers,
    fetchUserStats,
    removeUser,
} from "@/store/slices/AllUsersSlices/allUsersSlice";

import UserDeleteModal from "@/components/common/UserDeleteModal";
import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

import StatsCards from "@/components/common/StatsCard";
import Search from "@/components/common/Search";
import TableHeader from "@/components/common/TableHeader";
import Pagination from "@/components/common/Pagination";
import Action from "@/components/common/Action";
import Tags from "@/components/common/Tags";
import DateTime from "@/components/common/DateTime";
import TableSkeleton from "@/components/common/TableSkeleton";

const AllUsers = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const {
        users,
        pagination,
        stats,
        loading,
        statsLoading,
        deleteLoading,
    } = useAppSelector((state) => state.allUsers);

    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [exportOpen, setExportOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [deleteLoadingUserId, setDeleteLoadingUserId] =
        useState<number | null>(null);
    const [deleteModalUserId, setDeleteModalUserId] =
        useState<number | null>(null);

    /*
     * ==========================================
     * INITIAL DATA
     * ==========================================
     */

    useEffect(() => {
        dispatch(
            fetchAllUsers({
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

    useEffect(() => {
        dispatch(fetchUserStats());
    }, [dispatch]);

    /*
    * ==========================================
    * SEARCH
    * ==========================================
    */

    // User types immediately into the input
    const handleSearchChange = (value: string) => {
        setSearchInput(value);
    };

    // Wait 1000ms after the user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setCurrentPage(1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchInput]);

    /*
     * ==========================================
     * PAGINATION
     * ==========================================
     */

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (rows: number) => {
        setRowsPerPage(rows);
        setCurrentPage(1);
    };


    /*
     * ==========================================
     * DELETE
     * ==========================================
     */

    const handleDelete = async (userId: number) => {
        setDeleteLoadingUserId(userId);

        const result = await dispatch(removeUser(userId));

        setDeleteLoadingUserId(null);

        if (removeUser.fulfilled.match(result)) {
            toast.success("User deleted successfully");

            setDeleteModalUserId(null);

            /*
             * Refresh statistics because total users
             * has changed.
             */
            dispatch(fetchUserStats());

            /*
             * If the deleted user was the last record
             * on the current page, move back one page.
             */
            if (
                users.length === 1 &&
                currentPage > 1
            ) {
                setCurrentPage((page) => page - 1);
            }
        } else {
            toast.error(
                result.payload || "Failed to delete user"
            );
        }
    };

    /*
     * ==========================================
     * VIEW USER
     * ==========================================
     */

    const handleView = (userId: number) => {
        router.push(`/AllUsers/user-view?user_id=${userId}`);
    };

    /*
     * ==========================================
     * FORMATTERS
     * ==========================================
     */

    const formatDate = (date: string) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const formatTime = (date: string) => {
        if (!date) return "";

        return new Date(date).toLocaleTimeString(
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

        return parts.length > 0
            ? parts.join(", ")
            : "N/A";
    };

    const getAvatarText = (user: any) => {
        const name =
            user.full_name ||
            `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
            "User";

        const words = name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        // Two or more words → first letter of first two words
        // Example: "Ava Martinez" → "AM"
        if (words.length >= 2) {
            return `${words[0][0]}${words[1][0]}`.toUpperCase();
        }

        // One word → first two letters
        // Example: "Ava" → "AV"
        return words[0].slice(0, 2).toUpperCase();
    };
    /*
     * ==========================================
     * STATS
     * ==========================================
     */

    const statsData = [
        {
            label: "Total Users",
            value: stats.total_users,
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
            value: stats.active_users,
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
            value: stats.deactivated_users,
            icon: (
                <UserX
                    size={26}
                    className="text-orange-600"
                />
            ),
            bg: "bg-orange-50",
        },

        {
            label: "Blocked Users",
            value: stats.blocked_users,
            icon: (
                <ShieldAlert
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
            width: "90px",
        },
        {
            label: "User",
            width: "180px",
        },
        {
            label: "Email",
            width: "220px",
        },
        {
            label: "Login Type",
            width: "130px",
        },
        {
            label: "Location",
            width: "200px",
        },
        {
            label: "Status",
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
    const handleExport = () => {
        if (!users.length) {
            toast.info("No users available to export");
            return;
        }

        const headers = [
            "Name",
            "Username",
            "Email",
            "Login Type",
            "Location",
            "Status",
            "Created At",
        ];

        const rows = users.map((user) => {
            const location = formatLocation(
                user.city,
                user.state,
                user.country
            );

            const status = user.blocked_by_admin
                ? "Blocked"
                : user.is_deactivated
                    ? "Deactivated"
                    : "Active";

            return [
                user.full_name ||
                `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                "Unknown",

                user.user_name
                    ? `@${user.user_name.replace(/^@/, "")}`
                    : "N/A",

                user.email || "N/A",

                user.login_type || "N/A",

                location,

                status,

                user.createdAt || "N/A",
            ];
        });

        const csvContent = [
            headers.join(","),
            ...rows.map((row) =>
                row
                    .map((value) => `"${String(value).replace(/"/g, '""')}"`)
                    .join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "users.csv";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        toast.success("Users exported successfully");
    };
    return (
        <div className="px-5 py-5 md:px-6 lg:px-7">

            {/* ========================================
            HEADER
        ======================================== */}

            <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                    <h1 className="text-[28px] font-semibold text-[#101828]">
                        All Users
                    </h1>

                    <p className="mt-1 text-[14px] text-[#667085]">
                        Manage and monitor all registered users.
                    </p>
                </div>

                <div className="flex w-full items-center gap-3 lg:w-auto">

                    <div className="w-full lg:w-[305px]">
                        <Search
                            searchTerm={searchInput}
                            setSearchTerm={handleSearchChange}
                            placeholder="Search users by Name..."
                        />
                    </div>

                    <div className="relative shrink-0">
                        <button
                            type="button"
                            onClick={() => setExportOpen(!exportOpen)}
                            className="flex h-[40px] cursor-pointer items-center gap-2 rounded-[8px] border border-[#D0D5DD] bg-white px-4 text-[13px] font-semibold text-[#344054] transition-colors hover:bg-gray-50"
                        >
                            <Download size={16} />

                            <span>Export</span>

                            <ChevronDown
                                size={15}
                                className={`transition-transform ${exportOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {exportOpen && (
                            <div className="absolute right-0 z-50 mt-2 w-[160px] overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-lg">

                                <button
                                    type="button"
                                    onClick={() => {
                                        handleExport();
                                        setExportOpen(false);
                                    }}
                                    className="w-full px-4 py-3 text-left text-[13px] font-medium text-[#344054] transition-colors hover:bg-gray-50"
                                >
                                    Export as CSV
                                </button>

                            </div>
                        )}
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
                    loading={statsLoading}
                />
            </div>


            {/* ========================================
            TABLE
        ======================================== */}

            <div className="overflow-hidden rounded-[10px] border border-[#EAECF0] bg-white">

                <div className="w-full overflow-x-auto">

                    <table className="w-full min-w-[1200px] text-left border-collapse">

                        <TableHeader
                            columns={columns}
                            showCheckbox={false}
                        />

                        <tbody className="divide-y divide-[#EAECF0]">

                            {loading ? (

                                <TableSkeleton rows={rowsPerPage} />

                            ) : users.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan={8}
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
                                                No users found
                                            </p>

                                            <p className="mt-1 text-[13px] text-[#667085]">
                                                Try changing your search.
                                            </p>

                                        </div>
                                    </td>
                                </tr>

                            ) : (

                                users.map((user) => {

                                 
                                    const isDeleteLoading =
                                        deleteLoading &&
                                        deleteLoadingUserId ===
                                        user.user_id;

                                    const location =
                                        formatLocation(
                                            user.city,
                                            user.state,
                                            user.country
                                        );

                                    const isBlocked =
                                        user.blocked_by_admin;

                                    const isDeactivated =
                                        user.is_deactivated;

                                    return (
                                        <tr
                                            key={user.user_id}
                                            className="transition-colors hover:bg-[#F9FAFB]"
                                        >

                                            {/* IMAGE */}

                                            {/* IMAGE */}

                                            <td className="px-5 py-4">

                                                {user.profile_pic ? (

                                                    <img
                                                        src={user.profile_pic}
                                                        alt={
                                                            user.full_name ||
                                                            "User"
                                                        }
                                                        className="h-11 w-11 rounded-full border border-gray-200 object-cover"
                                                    />

                                                ) : (

                                                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D0D5DD] bg-[#EFF6FF] text-[13px] font-semibold text-[#2563EB]">
                                                        {getAvatarText(user)}
                                                    </div>

                                                )}

                                            </td>


                                            {/* USER */}

                                            <td className="px-5 py-4">

                                                <div className="min-w-0">

                                                    <p className="truncate text-[14px] font-semibold text-[#101828]">
                                                        {user.full_name ||
                                                            `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                                                            "Unknown"}
                                                    </p>

                                                    <p className="mt-1 truncate text-[12px] text-[#667085]">
                                                        {user.user_name
                                                            ? `@${user.user_name.replace(/^@/, "")}`
                                                            : "N/A"}
                                                    </p>

                                                </div>

                                            </td>


                                            {/* EMAIL */}

                                            <td className="px-5 py-4">

                                                <p className="max-w-[220px] truncate text-[13px] text-[#475467]">
                                                    {user.email || "N/A"}
                                                </p>

                                            </td>


                                            {/* LOGIN TYPE */}

                                            <td className="px-5 py-4">

                                                <Tags
                                                    text={
                                                        user.login_type
                                                            ? user.login_type
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                            user.login_type.slice(1)
                                                            : "N/A"
                                                    }
                                                    variant="blue"
                                                />

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
                                                        title={location}
                                                    >
                                                        {location}
                                                    </p>

                                                </div>

                                            </td>

                                            {/* STATUS */}


                                            <td className="px-5 py-4">

                                                <Tags
                                                    text={
                                                        isBlocked
                                                            ? "Blocked"
                                                            : isDeactivated
                                                                ? "Deactivated"
                                                                : "Active"
                                                    }
                                                    variant={
                                                        isBlocked
                                                            ? "red"
                                                            : isDeactivated
                                                                ? "orange"
                                                                : "green"
                                                    }
                                                />

                                            </td>


                                            {/* CREATED AT */}

                                            <td className="px-5 py-4">

                                                <DateTime
                                                    date={formatDate(
                                                        user.createdAt
                                                    )}
                                                    time={formatTime(
                                                        user.createdAt
                                                    )}
                                                />

                                            </td>


                                            {/* ACTION */}

                                            <td className="px-5 py-4">

                                                {isDeleteLoading ? (

                                                    <div className="flex items-center justify-center">

                                                        <div className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-gray-200">

                                                            <Loader2
                                                                size={17}
                                                                className="animate-spin text-gray-500"
                                                            />

                                                        </div>

                                                    </div>

                                                ) : (

                                                    <Action
                                                        showView
                                                        showDelete
                                                        showEdit={false}
                                                        onView={() =>
                                                            handleView(
                                                                user.user_id
                                                            )
                                                        }
                                                        onDelete={() =>
                                                            setDeleteModalUserId(
                                                                user.user_id
                                                            )
                                                        }
                                                    />

                                                )}

                                            </td>

                                        </tr>
                                    );
                                })

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

            {/* ========================================
                DELETE USER MODAL
            ======================================== */}

            {deleteModalUserId !== null && (
                <UserDeleteModal
                    onClose={() => {
                        if (!deleteLoading) {
                            setDeleteModalUserId(null);
                        }
                    }}
                    onConfirm={() => {
                        handleDelete(deleteModalUserId);
                    }}
                    title="Delete User?"
                    message="This user will be permanently deleted. You cannot undo this action."
                    confirmText="Delete"
                    loading={
                        deleteLoading &&
                        deleteLoadingUserId === deleteModalUserId
                    }
                />
            )}

        </div>
    );
};

export default AllUsers;