"use client";

import { useEffect } from "react";
import {
    ArrowLeft,
    ArrowDownCircle,
    CircleCheck,
    CircleX,
    Loader2,
    User,
    CreditCard,
    Coins,
    CalendarDays,
    Clock3,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    fetchWithdrawalDetails,
    approveWithdrawalThunk,
    rejectWithdrawalThunk,
    clearActionError,
} from "@/store/slices/WithdrawalSlices/withdrawalSlice";
import { toast } from "react-toastify";
import Tags from "@/components/common/Tags";

const formatDate = (date?: string) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const formatTime = (date?: string) => {
    if (!date) return "";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

const getStatusVariant = (status: string): "green" | "red" | "orange" | "gray" => {
    switch (status) {
        case "approved": return "green";
        case "rejected": return "red";
        case "pending": return "orange";
        default: return "gray";
    }
};

export default function WithdrawalView() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const transactionId = searchParams.get("transaction_id");

    const { selectedWithdrawal, detailsLoading, detailsError, actionLoading, actionError } =
        useAppSelector((state) => state.withdrawal);

    useEffect(() => {
        if (!transactionId) return;
        dispatch(fetchWithdrawalDetails(Number(transactionId)));
    }, [dispatch, transactionId]);

    const handleApprove = async () => {
        if (!selectedWithdrawal) return;
        dispatch(clearActionError());
        const result = await dispatch(approveWithdrawalThunk(selectedWithdrawal.transaction_id));
        if (approveWithdrawalThunk.fulfilled.match(result)) {
            toast.success("Withdrawal approved successfully.");
        } else {
            toast.error(result.payload || "Failed to approve withdrawal.");
        }
    };

    const handleReject = async () => {
        if (!selectedWithdrawal) return;
        dispatch(clearActionError());
        const result = await dispatch(rejectWithdrawalThunk(selectedWithdrawal.transaction_id));
        if (rejectWithdrawalThunk.fulfilled.match(result)) {
            toast.success("Withdrawal rejected successfully.");
        } else {
            toast.error(result.payload || "Failed to reject withdrawal.");
        }
    };

    if (detailsLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 size={28} className="animate-spin text-[#2563EB]" />
            </div>
        );
    }

    if (detailsError || !selectedWithdrawal) {
        return (
            <div className="min-h-full px-5 py-5 md:px-6 lg:px-7">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-6 flex cursor-pointer items-center gap-2 text-[13px] font-medium text-[#667085] transition-colors hover:text-[#101828]"
                >
                    <ArrowLeft size={16} />
                    Back to Withdrawal List
                </button>
                <div className="flex min-h-[450px] items-center justify-center rounded-[16px] border border-[#EAECF0] bg-white">
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                            <ArrowDownCircle size={26} className="text-red-500" />
                        </div>
                        <h2 className="text-[18px] font-semibold text-[#101828]">Unable to load withdrawal</h2>
                        <p className="mt-2 text-[14px] text-[#667085]">{detailsError || "Withdrawal could not be found."}</p>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="mt-5 rounded-[8px] bg-[#2563EB] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-blue-700"
                        >
                            Back to Withdrawal List
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const w = selectedWithdrawal;
    const isPending = w.success === "pending";

    return (
        <div className="min-h-full px-5 py-5 md:px-6 lg:px-7">
            <button
                type="button"
                onClick={() => router.back()}
                className="mb-6 flex cursor-pointer items-center gap-2 text-[13px] font-medium text-[#667085] transition-colors hover:text-[#101828]"
            >
                <ArrowLeft size={16} />
                Back to Withdrawal List
            </button>

            <div className="mb-6">
                <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#101828]">Withdrawal Details</h1>
                <p className="mt-1 text-[14px] text-[#667085]">Review withdrawal request information.</p>
            </div>

            {/* User Info */}
            <Section title="User Information" icon={<User size={18} />}>
                <div className="grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-2 lg:grid-cols-3">
                    <InfoItem label="Full Name" value={`${w.User?.first_name} ${w.User?.last_name}`} />
                    <InfoItem label="Username" value={w.User?.user_name ? `@${w.User.user_name}` : "N/A"} />
                    <InfoItem label="Email" value={w.User?.email || "N/A"} />
                    <InfoItem label="User ID" value={String(w.user_id)} />
                </div>
            </Section>

            {/* Transaction Info */}
            <Section title="Transaction Information" icon={<CreditCard size={18} />}>
                <div className="grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-2 lg:grid-cols-3">
                    <InfoItem label="Transaction ID" value={String(w.transaction_id)} />
                    <InfoItem label="Payment Method" value={w.payment_method} />
                    <InfoItem label="Amount" value={`${w.acutal_money} ${w.currency}`} />
                    <InfoItem label="Available Money" value={w.available_money} />
                    <InfoItem label="Tax" value={String(w.tax)} />
                    <InfoItem label="Admin Margin" value={String(w.admin_margin)} />
                    {w.transaction_id_gateway && (
                        <InfoItem label="Gateway Transaction ID" value={w.transaction_id_gateway} />
                    )}
                    {w.transaction_email && (
                        <InfoItem label="Transaction Email" value={w.transaction_email} />
                    )}
                </div>
            </Section>

            {/* Coin Info */}
            <Section title="Coin Information" icon={<Coins size={18} />}>
                <div className="grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-2 lg:grid-cols-3">
                    <InfoItem label="Coins" value={w.coin} />
                    <InfoItem label="Coin Price" value={w.coin_price} />
                    <InfoItem label="Past Coins" value={w.past_coin} />
                    <InfoItem label="New Available Coins" value={w.new_available_coin} />
                </div>
            </Section>

            {/* Status & Actions */}
            <Section title="Status & Actions" icon={<CircleCheck size={18} />} className="mb-2">
                <div className="mb-6 flex items-center gap-3">
                    <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#98A2B3]">Current Status:</p>
                    <Tags
                        text={w.success.charAt(0).toUpperCase() + w.success.slice(1)}
                        variant={getStatusVariant(w.success)}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
                    <div className="flex items-center gap-4 rounded-[11px] border border-[#EAECF0] bg-[#F9FAFB] px-4 py-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] bg-blue-50 text-blue-600">
                            <CalendarDays size={18} />
                        </div>
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#98A2B3]">Created</p>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                <span className="text-[14px] font-semibold text-[#344054]">{formatDate(w.createdAt)}</span>
                                {formatTime(w.createdAt) && (
                                    <>
                                        <span className="h-1 w-1 rounded-full bg-[#98A2B3]" />
                                        <span className="text-[13px] text-[#667085]">{formatTime(w.createdAt)}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-[11px] border border-[#EAECF0] bg-[#F9FAFB] px-4 py-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] bg-emerald-50 text-emerald-600">
                            <Clock3 size={18} />
                        </div>
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#98A2B3]">Last Updated</p>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                <span className="text-[14px] font-semibold text-[#344054]">{formatDate(w.updatedAt)}</span>
                                {formatTime(w.updatedAt) && (
                                    <>
                                        <span className="h-1 w-1 rounded-full bg-[#98A2B3]" />
                                        <span className="text-[13px] text-[#667085]">{formatTime(w.updatedAt)}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {isPending && (
                    <div>
                        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.04em] text-[#98A2B3]">Actions</p>
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                disabled={actionLoading !== null}
                                onClick={handleReject}
                                className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[9px] border border-red-200 bg-red-50 px-5 text-[13px] font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {actionLoading === "reject" ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <CircleX size={16} />
                                )}
                                Reject
                            </button>
                            <button
                                type="button"
                                disabled={actionLoading !== null}
                                onClick={handleApprove}
                                className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[9px] bg-[#2563EB] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {actionLoading === "approve" ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <CircleCheck size={16} />
                                )}
                                Approve
                            </button>
                        </div>
                    </div>
                )}

                {actionError && (
                    <div className="mt-4 rounded-[9px] border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-[13px] font-medium text-red-600">{actionError}</p>
                    </div>
                )}
            </Section>
        </div>
    );
}

function Section({
    title,
    icon,
    children,
    className = "mb-6",
}: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`${className} overflow-hidden rounded-[14px] border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.02)]`}>
            <div className="flex items-center gap-3 border-b border-[#EAECF0] px-6 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#EFF6FF] text-[#2563EB]">
                    {icon}
                </div>
                <h2 className="text-[15px] font-semibold text-[#101828]">{title}</h2>
            </div>
            <div className="px-6 py-6">{children}</div>
        </div>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="min-w-0">
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-[#98A2B3]">{label}</p>
            <p className="truncate text-[14px] font-medium text-[#344054]" title={value}>{value}</p>
        </div>
    );
}
