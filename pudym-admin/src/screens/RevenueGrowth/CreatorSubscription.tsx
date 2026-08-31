"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    CalendarDays,
    ChevronDown,
    RefreshCw,
} from "lucide-react";

import { fetchCreatorSubscriptionReport } from "@/store/slices/RevenueGrowthSlices/creatorSubscriptionSlice";
import TableHeader from "@/components/common/TableHeader";
import Tags from "@/components/common/Tags";
import DateTime from "@/components/common/DateTime";
import TableSkeleton from "@/components/common/TableSkeleton";

type Period =
    | "today"
    | "week"
    | "month"
    | "year";

const periodOptions: {
    label: string;
    value: Period;
}[] = [
        { label: "Today", value: "today" },
        { label: "This Week", value: "week" },
        { label: "This Month", value: "month" },
        { label: "This Year", value: "year" },
    ];

const formatDate = (dateString: string) => {
    if (!dateString) {
        return "-";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatTime = (dateString: string) => {
    if (!dateString) {
        return "";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

const formatAmount = (amount: number) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
};

const capitalize = (value: string) => {
    if (!value) {
        return "-";
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
};

export default function CreatorSubscription() {
    const dispatch = useDispatch<any>();

    const {
        data,
        loading,
        error,
    } = useSelector(
        (state: any) => state.creatorSubscription
    );

    const [period, setPeriod] =
        useState<Period>("month");

    const [showPeriodDropdown, setShowPeriodDropdown] =
        useState(false);

    useEffect(() => {
        dispatch(
            fetchCreatorSubscriptionReport(period)
        );
    }, [dispatch, period]);

    const subscriptions =
        data?.data || data?.subscriptions || [];

    const handlePeriodChange = (
        selectedPeriod: Period
    ) => {
        setPeriod(selectedPeriod);
        setShowPeriodDropdown(false);
    };



    const handleRefresh = () => {
        dispatch(
            fetchCreatorSubscriptionReport(period)
        );
    };
    const columns = [
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
            width: "230px",
        },
        {
            label: "Amount",
            width: "120px",
        },
        {
            label: "Payment Status",
            width: "150px",
        },
        {
            label: "Status",
            width: "120px",
        },
        {
            label: "Created At",
            width: "160px",
        },
    ];

    return (
        <div className="min-h-full bg-[#F8FAFC] px-6 py-6 font-poppins">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                    <h1 className="text-[24px] font-bold text-[#101828]">
                        Creator Subscriptions
                    </h1>

                    <p className="text-[13px] text-[#667085] mt-1">
                        Creator subscription payments recorded during the selected period.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* PERIOD DROPDOWN */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() =>
                                setShowPeriodDropdown(
                                    (prev) => !prev
                                )
                            }
                            className="h-[42px] min-w-[150px] px-4 bg-white border border-[#D0D5DD] rounded-[8px] flex items-center justify-between gap-3 text-[13px] font-medium text-[#344054] hover:bg-gray-50 transition"
                        >
                            <div className="flex items-center gap-2">
                                <CalendarDays
                                    size={16}
                                    className="text-[#667085]"
                                />

                                <span>
                                    {
                                        periodOptions.find(
                                            (item) =>
                                                item.value ===
                                                period
                                        )?.label
                                    }
                                </span>
                            </div>

                            <ChevronDown
                                size={16}
                                className="text-[#667085]"
                            />
                        </button>

                        {showPeriodDropdown && (
                            <div className="absolute right-0 top-[48px] z-30 w-[180px] bg-white border border-[#EAECF0] rounded-[8px] shadow-lg py-1">
                                {periodOptions.map(
                                    (option) => (
                                        <button
                                            key={
                                                option.value
                                            }
                                            type="button"
                                            onClick={() =>
                                                handlePeriodChange(
                                                    option.value
                                                )
                                            }
                                            className={`w-full text-left px-4 py-2.5 text-[13px] transition ${period ===
                                                option.value
                                                ? "bg-[#EFF6FF] text-[#175CD3] font-medium"
                                                : "text-[#344054] hover:bg-gray-50"
                                                }`}
                                        >
                                            {
                                                option.label
                                            }
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {/* REFRESH */}
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={loading}
                        className="h-[42px] w-[42px] bg-white border border-[#D0D5DD] rounded-[8px] flex items-center justify-center text-[#667085] hover:bg-gray-50 transition disabled:opacity-50"
                        title="Refresh"
                    >
                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? "animate-spin"
                                    : ""
                            }
                        />
                    </button>
                </div>
            </div>



            {/* ERROR */}
            {error && (
                <div className="mb-5 bg-[#FEF3F2] border border-[#FECDCA] rounded-[8px] px-4 py-3 text-[13px] text-[#B42318]">
                    {error}
                </div>
            )}



            {/* TABLE CARD */}
            <div className="bg-white border border-[#EAECF0] rounded-[10px] overflow-hidden">
                

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1100px] border-collapse">
                        <TableHeader
                            columns={columns}
                            showCheckbox={false}
                        />

                        <tbody>
                            {loading ? (
                                <TableSkeleton rows={6} />
                            ) : subscriptions.length > 0 ? (
                                subscriptions.map(
                                    (
                                        subscription: any
                                    ) => (
                                        <tr
                                            key={
                                                subscription.subscription_id
                                            }
                                            className="border-b border-[#EAECF0] last:border-b-0 hover:bg-[#FCFCFD] transition"
                                        >
                                            {/* SUBSCRIPTION ID */}
                                            <td className="pl-14 px-5 py-4">
                                                <span className="text-[13px] font-semibold text-[#101828]">
                                                    #
                                                    {
                                                        subscription.subscription_id
                                                    }
                                                </span>
                                            </td>

                                            {/* CREATOR */}
                                            <td className="pl-12 px-5 py-4">
                                                <div>
                                                    <p className="text-[13px] font-semibold text-[#101828]">
                                                        {
                                                            subscription.creator_name
                                                        }
                                                    </p>

                                                    <p className="text-[11px] text-[#667085] mt-0.5">
                                                        ID:{" "}
                                                        {
                                                            subscription.creator_id
                                                        }
                                                    </p>
                                                </div>
                                            </td>

                                            {/* SUBSCRIBER */}
                                            <td className="pl-14 px-5 py-4">
                                                <div>
                                                    <p className="text-[13px] font-medium text-[#344054]">
                                                        {
                                                            subscription.subscriber_name
                                                        }
                                                    </p>

                                                    <p className="text-[11px] text-[#667085] mt-0.5">
                                                        ID:{" "}
                                                        {
                                                            subscription.subscriber_id
                                                        }
                                                    </p>
                                                </div>
                                            </td>

                                            {/* PLAN */}
                                            <td className="pl-12 px-5 py-4">
                                                <span className="text-[13px] text-[#344054]">
                                                    {
                                                        subscription.plan_name
                                                    }
                                                </span>
                                            </td>

                                            {/* AMOUNT */}
                                            <td className="pl-14 px-5 py-4">
                                                <span className="text-[13px] font-semibold text-[#101828]">
                                                    {formatAmount(
                                                        subscription.amount
                                                    )}
                                                </span>
                                            </td>

                                            {/* PAYMENT STATUS */}
                                            <td className="pl-12 px-5 py-4">
                                                <Tags
                                                    text={capitalize(subscription.payment_status)}
                                                    variant={
                                                        subscription.payment_status?.toLowerCase() === "paid"
                                                            ? "green"
                                                            : subscription.payment_status?.toLowerCase() === "pending"
                                                                ? "orange"
                                                                : subscription.payment_status?.toLowerCase() === "failed"
                                                                    ? "red"
                                                                    : "gray"
                                                    }
                                                />
                                            </td>

                                            {/* STATUS */}
                                            <td className="pl-10 px-5 py-4">
                                                <Tags
                                                    text={capitalize(subscription.status)}
                                                    variant={
                                                        subscription.status?.toLowerCase() === "active"
                                                            ? "green"
                                                            : subscription.status?.toLowerCase() === "cancelled"
                                                                ? "red"
                                                                : "gray"
                                                    }
                                                />
                                            </td>

                                            {/* CREATED AT */}
                                            <td className="pl-14 px-5 py-4">
                                                <DateTime
                                                    date={formatDate(
                                                        subscription.created_at
                                                    )}
                                                    time={formatTime(
                                                        subscription.created_at
                                                    )}
                                                />
                                            </td>
                                        </tr>
                                    )
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-5 py-16 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-12 h-12 rounded-full bg-[#F2F4F7] flex items-center justify-center mb-3">
                                                <CalendarDays
                                                    size={21}
                                                    className="text-[#667085]"
                                                />
                                            </div>

                                            <p className="text-[14px] font-semibold text-[#344054]">
                                                No subscriptions found
                                            </p>

                                            <p className="text-[12px] text-[#667085] mt-1">
                                                There are no creator subscriptions for the selected period.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>


            </div>
        </div>
    );
}