"use client";

import { useEffect, useMemo, useState } from "react";

import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

import {
    fetchUserGrowthReport,
} from "@/store/slices/RevenueGrowthSlices/userGrowthSlice";

import TableHeader from "@/components/common/TableHeader";
import Pagination from "@/components/common/Pagination";
import TableSkeleton from "@/components/common/TableSkeleton";

const UserGrowth = () => {
    const dispatch = useAppDispatch();

    const {
        data,
        loading,
        error,
    } = useAppSelector(
        (state) => state.userGrowth
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    /*
     * ==========================================
     * FETCH DATA
     * ==========================================
     */

    useEffect(() => {
        dispatch(fetchUserGrowthReport("month"));
    }, [dispatch]);

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

    const users = data?.data || [];

    /*
     * ==========================================
     * TABLE COLUMNS
     * ==========================================
     */

    const columns = [
        {
            label: "User ID",
            width: "110px",
        },
        {
            label: "User",
            width: "220px",
        },
        {
            label: "Email",
            width: "260px",
        },
        {
            label: "Username",
            width: "180px",
        },
        {
            label: "Role",
            width: "120px",
        },
        {
            label: "Registered At",
            width: "180px",
        },
    ];

    /*
     * ==========================================
     * CLIENT-SIDE PAGINATION
     * ==========================================
     */

    const totalPages = Math.max(
        1,
        Math.ceil(
            users.length / rowsPerPage
        )
    );

    const paginatedUsers = useMemo(() => {
        const start =
            (currentPage - 1) * rowsPerPage;

        return users.slice(
            start,
            start + rowsPerPage
        );
    }, [
        users,
        currentPage,
        rowsPerPage,
    ]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (
        rows: number
    ) => {
        setRowsPerPage(rows);
        setCurrentPage(1);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [data]);

    return (
        <div className="px-5 py-5 md:px-6 lg:px-7">

            {/* ========================================
                HEADER
            ======================================== */}

            <div className="mb-7">
                <h1 className="text-[28px] font-semibold text-[#101828]">
                    User Growth
                </h1>

                <p className="mt-1 text-[14px] text-[#667085]">
                    View users registered during the selected period.
                </p>
            </div>

            {/* ========================================
                ERROR
            ======================================== */}

            {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}


            {/* ========================================
                TABLE
            ======================================== */}

            <div className="overflow-hidden rounded-[10px] border border-[#EAECF0] bg-white">

                <div className="w-full overflow-x-auto">

                    <table className="w-full min-w-[1050px] text-left border-collapse">

                        <TableHeader
                            columns={columns}
                            showCheckbox={false}
                        />

                        <tbody className="divide-y divide-[#EAECF0]">

                            {loading ? (

                                <TableSkeleton rows={rowsPerPage} />

                            ) : paginatedUsers.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-16 text-center"
                                    >
                                        <p className="text-[15px] font-semibold text-[#101828]">
                                            No users found
                                        </p>

                                        <p className="mt-1 text-[13px] text-[#667085]">
                                            No new users were registered during this period.
                                        </p>
                                    </td>
                                </tr>

                            ) : (

                                paginatedUsers.map(
                                    (user) => (
                                        <tr
                                            key={user.user_id}
                                            className="transition-colors hover:bg-[#F9FAFB]"
                                        >

                                            {/* USER ID */}

                                            <td className="px-5 py-4">
                                                <p className="text-[13px] font-semibold text-[#101828]">
                                                    #{user.user_id}
                                                </p>
                                            </td>

                                            {/* USER */}

                                            <td className="px-5 py-4">
                                                <div>
                                                    <p className="text-[14px] font-semibold text-[#101828]">
                                                        {user.full_name || "N/A"}
                                                    </p>

                                                    <p className="mt-1 text-[12px] text-[#667085]">
                                                        {user.user_name
                                                            ? `@${user.user_name.replace(/^@/, "")}`
                                                            : "N/A"}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* EMAIL */}

                                            <td className="px-5 py-4">
                                                <p className="max-w-[260px] truncate text-[13px] text-[#475467]">
                                                    {user.email || "N/A"}
                                                </p>
                                            </td>

                                            {/* USERNAME */}

                                            <td className="px-5 py-4">
                                                <p className="text-[13px] text-[#475467]">
                                                    {user.user_name
                                                        ? `@${user.user_name.replace(/^@/, "")}`
                                                        : "N/A"}
                                                </p>
                                            </td>

                                            {/* ROLE */}

                                            <td className="px-5 py-4">
                                                <p className="text-[13px] font-medium capitalize text-[#475467]">
                                                    {user.role || "N/A"}
                                                </p>
                                            </td>

                                            {/* CREATED */}

                                            <td className="px-5 py-4">
                                                <div>
                                                    <p className="text-[13px] text-[#475467]">
                                                        {formatDate(
                                                            user.created_at
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-[12px] text-[#98A2B3]">
                                                        {formatTime(
                                                            user.created_at
                                                        )}
                                                    </p>
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
                users.length > 0 && (

                    <div className="mt-5 w-full">

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handlePageChange}
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

export default UserGrowth;