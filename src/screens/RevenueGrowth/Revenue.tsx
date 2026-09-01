"use client";

import { useEffect } from "react";
import {
    DollarSign,
    Wallet,
    BadgeDollarSign,
    Receipt,
    Users,
} from "lucide-react";

import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

import {
    fetchRevenueReport,
} from "@/store/slices/RevenueGrowthSlices/revenueReportSlice";

import StatsCards from "@/components/common/StatsCard";
import TableHeader from "@/components/common/TableHeader";

import Tags from "@/components/common/Tags";
import DateTime from "@/components/common/DateTime";
import TableSkeleton from "@/components/common/TableSkeleton";

const Revenue = () => {
    const dispatch = useAppDispatch();

    const {
        data,
        loading,
        error,
    } = useAppSelector(
        (state) => state.revenueReport
    );

    useEffect(() => {
        dispatch(fetchRevenueReport("month"));
    }, [dispatch]);

    /*
     * ==========================================
     * FORMATTERS
     * ==========================================
     */

    const formatCurrency = (
        value: number,
        currency = "INR"
    ) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency,
            maximumFractionDigits: 0,
        }).format(value || 0);
    };

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

    const formatText = (value: string) => {
        if (!value) return "N/A";

        return value.charAt(0).toUpperCase() + value.slice(1);
    };

    /*
     * ==========================================
     * STATS
     * ==========================================
     */

    const statsData = [
        {
            label: "Total Revenue",
            value: formatCurrency(
                data?.summary.total_revenue || 0
            ),
            icon: (
                <DollarSign
                    size={26}
                    className="text-emerald-600"
                />
            ),
            bg: "bg-emerald-50",
        },

        {
            label: "User Recharge Revenue",
            value: formatCurrency(
                data?.summary.total_user_recharge_revenue || 0
            ),
            icon: (
                <Wallet
                    size={26}
                    className="text-blue-600"
                />
            ),
            bg: "bg-blue-50",
        },

        {
            label: "Creator Revenue",

            icon: (
                <BadgeDollarSign
                    size={26}
                    className="text-purple-600"
                />
            ),
            bg: "bg-purple-50",
        },

        {
            label: "Total Transactions",
            value:
                data?.summary.total_transactions || 0,
            icon: (
                <Receipt
                    size={26}
                    className="text-orange-600"
                />
            ),
            bg: "bg-orange-50",
        },


    ];

    /*
     * ==========================================
     * TRANSACTION TABLE
     * ==========================================
     */

    const transactionColumns = [
        {
            label: "Transaction ID",
            width: "130px",
        },
        {
            label: "User",
            width: "220px",
        },
        {
            label: "Email",
            width: "240px",
        },
        {
            label: "Amount",
            width: "140px",
        },
        {
            label: "Type",
            width: "140px",
        },
        {
            label: "Payment Method",
            width: "160px",
        },
        {
            label: "Status",
            width: "130px",
        },
        {
            label: "Created At",
            width: "160px",
        },
    ];

    /*
     * ==========================================
     * SUBSCRIPTION TABLE
     * ==========================================
     */

    const subscriptionColumns = [
        {
            label: "Subscription ID",
            width: "140px",
        },
        {
            label: "Creator",
            width: "220px",
        },
        {
            label: "Subscriber",
            width: "220px",
        },
        {
            label: "Plan",
            width: "220px",
        },
        {
            label: "Amount",
            width: "140px",
        },
        {
            label: "Payment Status",
            width: "150px",
        },
        {
            label: "Status",
            width: "130px",
        },
        {
            label: "Created At",
            width: "160px",
        },
    ];
    const transactions = data?.transactions || [];


    return (
        <div className="px-5 py-5 md:px-6 lg:px-7">



            {/* ========================================
                ERROR
            ======================================== */}

            {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* ========================================
                STATS
            ======================================== */}


            {/* ========================================
                TRANSACTIONS
            ======================================== */}

            <div className="mb-7">

                <div className="mb-4">
                    <h1 className="text-[24px] font-bold text-[#101828]">
                        Transactions
                    </h1>

                    <p className="mt-1 text-[13px] text-[#667085]">
                        User recharge transactions recorded during the selected period.
                    </p>
                </div>

                <div className="overflow-hidden rounded-[10px] border border-[#EAECF0] bg-white">

                    <div className="w-full overflow-x-auto">

                        <table className="w-full min-w-[1300px] text-left border-collapse">

                            <TableHeader
                                columns={transactionColumns}
                                showCheckbox={false}
                            />

                            <tbody className="divide-y divide-[#EAECF0]">

                                {loading ? (

                                    <TableSkeleton rows={10} />

                                ) : transactions.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-6 py-16 text-center"
                                        >
                                            <p className="text-[15px] font-semibold text-[#101828]">
                                                No transactions found
                                            </p>

                                            <p className="mt-1 text-[13px] text-[#667085]">
                                                No transactions are available for this period.
                                            </p>
                                        </td>
                                    </tr>

                                ) : (

                                    transactions.map(
                                        (transaction) => (
                                            <tr
                                                key={transaction.transaction_id}
                                                className="transition-colors hover:bg-[#F9FAFB]"
                                            >

                                                <td className="px-5 py-4">
                                                    <p className="text-[13px] font-semibold text-[#101828]">
                                                        #{transaction.transaction_id}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div>
                                                        <p className="text-[14px] font-semibold text-[#101828]">
                                                            {transaction.full_name || "N/A"}
                                                        </p>

                                                        <p className="mt-1 text-[12px] text-[#667085]">
                                                            {transaction.user_name
                                                                ? `@${transaction.user_name.replace(/^@/, "")}`
                                                                : "N/A"}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="max-w-[240px] truncate text-[13px] text-[#475467]">
                                                        {transaction.email || "N/A"}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="text-[14px] font-semibold text-[#101828]">
                                                        {formatCurrency(
                                                            transaction.amount,
                                                            transaction.currency || "INR"
                                                        )}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <Tags
                                                        text={formatText(
                                                            transaction.transaction_type
                                                        )}
                                                        variant="blue"
                                                    />
                                                </td>

                                                <td className="px-5 py-4">
                                                    <Tags
                                                        text={formatText(
                                                            transaction.payment_method
                                                        )}
                                                        variant="purple"
                                                    />
                                                </td>

                                                <td className="px-5 py-4">
                                                    <Tags
                                                        text={formatText(
                                                            transaction.success
                                                        )}
                                                        variant={
                                                            transaction.success === "success"
                                                                ? "green"
                                                                : "red"
                                                        }
                                                    />
                                                </td>

                                                <td className="px-5 py-4">
                                                    <DateTime
                                                        date={formatDate(
                                                            transaction.created_at
                                                        )}
                                                        time={formatTime(
                                                            transaction.created_at
                                                        )}
                                                    />
                                                </td>

                                            </tr>
                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

                

            </div>



        </div>
    );
};

export default Revenue;