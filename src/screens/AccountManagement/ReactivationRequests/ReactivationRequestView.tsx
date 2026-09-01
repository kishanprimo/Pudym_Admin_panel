"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ShieldCheck,
    ShieldAlert,
    FileText,
    CheckCircle2,
    XCircle,
    Clock3,
    Hash,
    Activity,
    MessageSquareText,
} from "lucide-react";

import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

import {
    fetchReactivationRequestDetail,
    approveReactivationRequestAction,
    rejectReactivationRequestAction,
} from "@/store/slices/AccountManagement/reactivationRequestsSlice";

import ActivationModal from "@/components/common/ActivationModal";
import Tags from "@/components/common/Tags";
import DateTime from "@/components/common/DateTime";

const ReactivationRequestView = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    const {
        detail,
        detailLoading,
        detailError,
        actionLoading,
        actionError,
    } = useAppSelector(
        (state) => state.reactivationRequests
    );

    const requestId = searchParams.get("request_id");

    const [isApproveModalOpen, setIsApproveModalOpen] =
        useState(false);

    const [isRejectModalOpen, setIsRejectModalOpen] =
        useState(false);

    useEffect(() => {
        if (!requestId) {
            return;
        }

        const id = Number(requestId);

        if (Number.isNaN(id)) {
            return;
        }

        dispatch(
            fetchReactivationRequestDetail(id)
        );
    }, [dispatch, requestId]);

    /*
     * ==========================================
     * HELPERS
     * ==========================================
     */

    const formatDate = (date?: string) => {
        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const formatTime = (date?: string) => {
        if (!date) {
            return "";
        }

        return new Date(date).toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "approved":
                return "green";

            case "rejected":
                return "red";

            default:
                return "orange";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "approved":
                return "Approved";

            case "rejected":
                return "Rejected";

            default:
                return "Pending";
        }
    };

    const getAvatarText = (
        fullName?: string
    ) => {
        const words = fullName
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
                .toUpperCase() || "U"
        );
    };

    const handleApprove = async (
        adminNote: string
    ) => {
        if (!requestId) {
            return;
        }

        const result = await dispatch(
            approveReactivationRequestAction({
                requestId: Number(requestId),
                adminNote:
                    adminNote || undefined,
            })
        );

        if (
            approveReactivationRequestAction.fulfilled.match(
                result
            )
        ) {
            setIsApproveModalOpen(false);

            await dispatch(
                fetchReactivationRequestDetail(
                    Number(requestId)
                )
            );
        }
    };

    const handleReject = async (
        adminNote: string
    ) => {
        if (!requestId) {
            return;
        }

        const result = await dispatch(
            rejectReactivationRequestAction({
                requestId: Number(requestId),
                adminNote,
            })
        );

        if (
            rejectReactivationRequestAction.fulfilled.match(
                result
            )
        ) {
            setIsRejectModalOpen(false);

            await dispatch(
                fetchReactivationRequestDetail(
                    Number(requestId)
                )
            );
        }
    };

    /*
     * ==========================================
     * INVALID REQUEST ID
     * ==========================================
     */

    if (!requestId) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] px-5 py-6 md:px-6 lg:px-8">
                <div className="mx-auto max-w-[1500px]">
                    <div className="rounded-2xl border border-[#E2E8F0] bg-white px-6 py-20 text-center shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EFF6FF]">
                            <ShieldAlert
                                size={25}
                                className="text-[#2563EB]"
                            />
                        </div>

                        <p className="text-[16px] font-semibold text-[#0F172A]">
                            Invalid request
                        </p>

                        <p className="mt-1 text-[13px] text-[#64748B]">
                            Request ID is missing.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    "/AccountManagement/reactivation-requests"
                                )
                            }
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#1D4ED8]"
                        >
                            <ArrowLeft size={16} />
                            Back to Requests
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /*
     * ==========================================
     * LOADING
     * ==========================================
     */

    if (detailLoading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] px-5 py-6 md:px-6 lg:px-6">
                <div className="w-full">

                    <div className="mb-7">
                        <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

                        <div className="mt-5 h-9 w-72 animate-pulse rounded-lg bg-slate-200" />

                        <div className="mt-2 h-4 w-96 animate-pulse rounded bg-slate-100" />
                    </div>

                    <div className="space-y-5">

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    /*
     * ==========================================
     * ERROR
     * ==========================================
     */

    if (detailError || !detail) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] px-5 py-6 md:px-6 lg:px-6">
                <div className="w-full">

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/AccountManagement/reactivation-requests"
                            )
                        }
                        className="mb-6 flex items-center gap-2 text-[13px] font-semibold text-[#475467] transition hover:text-[#2563EB]"
                    >
                        <ArrowLeft size={17} />
                        Back to Requests
                    </button>

                    <div className="rounded-2xl border border-[#E2E8F0] bg-white px-6 py-20 text-center shadow-[0_2px_8px_rgba(15,23,42,0.03)]">

                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                            <ShieldAlert
                                size={25}
                                className="text-red-500"
                            />
                        </div>

                        <p className="text-[16px] font-semibold text-[#0F172A]">
                            Unable to load request
                        </p>

                        <p className="mx-auto mt-1 max-w-md text-[13px] leading-6 text-[#64748B]">
                            {detailError ||
                                "Reactivation request was not found."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const {
        request,
        user,
        content,
        moderation,
    } = detail;

    return (
        <div className="min-h-screen bg-[#F8FAFC] px-5 py-6 md:px-6 lg:px-6">
            <div className="w-full">
                {/* ========================================
                    HEADER
                ======================================== */}

                <div className="mb-7">

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/AccountManagement/reactivation-requests"
                            )
                        }
                        className="group mb-5 inline-flex items-center gap-2 text-[13px] font-semibold text-[#64748B] transition hover:text-[#2563EB]"
                    >
                        <ArrowLeft
                            size={17}
                            className="transition-transform group-hover:-translate-x-0.5"
                        />
                        Back to Requests
                    </button>

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                        <div>
                            <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#2563EB]">
                                <Activity size={14} />
                                Account Management
                            </div>

                            <h1 className="text-[30px] font-bold tracking-[-0.02em] text-[#0F172A]">
                                Reactivation Request
                            </h1>

                            <p className="mt-1.5 text-[14px] text-[#64748B]">
                                Review the account details and request before taking action.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-[12px] font-medium text-[#64748B] shadow-sm sm:flex">
                                <Hash
                                    size={14}
                                    className="text-[#94A3B8]"
                                />
                                Request #{request.request_id}
                            </div>

                            <Tags
                                text={getStatusLabel(
                                    request.status
                                )}
                                variant={
                                    getStatusVariant(
                                        request.status
                                    ) as any
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* ========================================
                    USER PROFILE HERO
                ======================================== */}

                <div className="mb-5 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">

                    <div className="h-2 bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA]" />

                    <div className="p-6 md:p-7">

                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">

                            <div className="relative shrink-0">
                                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-[#BFDBFE] bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-[28px] font-bold text-[#2563EB] shadow-sm">
                                    {getAvatarText(
                                        user.full_name
                                    )}
                                </div>

                                {user.profile_verification_status && (
                                    <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#16A34A] text-white shadow-sm">
                                        <ShieldCheck
                                            size={14}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                                    <div>
                                        <h2 className="text-[23px] font-bold tracking-[-0.01em] text-[#0F172A]">
                                            {user.full_name ||
                                                "Unknown User"}
                                        </h2>

                                        <p className="mt-1 text-[13px] text-[#64748B]">
                                            @{user.user_name ||
                                                "N/A"}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Tags
                                            text={
                                                user.role ||
                                                "user"
                                            }
                                            variant="blue"
                                        />

                                        {user.is_deactivated && (
                                            <Tags
                                                text="Deactivated"
                                                variant="orange"
                                            />
                                        )}

                                        {user.blocked_by_admin && (
                                            <Tags
                                                text="Blocked"
                                                variant="red"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                                    <div className="flex items-center gap-3 rounded-xl bg-[#F8FAFC] px-3.5 py-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                                            <Mail
                                                size={15}
                                                className="text-[#64748B]"
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                                                Email
                                            </p>

                                            <p className="mt-0.5 truncate text-[12px] font-medium text-[#334155]">
                                                {user.email ||
                                                    "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-xl bg-[#F8FAFC] px-3.5 py-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                                            <Phone
                                                size={15}
                                                className="text-[#64748B]"
                                            />
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                                                Mobile
                                            </p>

                                            <p className="mt-0.5 text-[12px] font-medium text-[#334155]">
                                                {user.country_code}{" "}
                                                {user.mobile_num ||
                                                    "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-xl bg-[#F8FAFC] px-3.5 py-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                                            <MapPin
                                                size={15}
                                                className="text-[#64748B]"
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                                                Location
                                            </p>

                                            <p className="mt-0.5 truncate text-[12px] font-medium text-[#334155]">
                                                {[
                                                    user.city,
                                                    user.state,
                                                    user.country,
                                                ]
                                                    .filter(Boolean)
                                                    .join(
                                                        ", "
                                                    ) ||
                                                    "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {user.bio && (
                            <div className="mt-6 border-t border-[#F1F5F9] pt-5">
                                <div className="flex gap-3">
                                    <MessageSquareText
                                        size={16}
                                        className="mt-0.5 shrink-0 text-[#94A3B8]"
                                    />

                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                                            Bio
                                        </p>

                                        <p className="mt-1 text-[13px] leading-6 text-[#475569]">
                                            {user.bio}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ========================================
                    USER DETAILS
                ======================================== */}

                <div className="mb-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">

                    <div className="flex items-center justify-between border-b border-[#EEF2F6] px-6 py-4.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EFF6FF]">
                                <User
                                    size={17}
                                    className="text-[#2563EB]"
                                />
                            </div>

                            <div>
                                <h2 className="text-[15px] font-semibold text-[#0F172A]">
                                    User Information
                                </h2>

                                <p className="mt-0.5 text-[11px] text-[#94A3B8]">
                                    Personal and account information
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3">

                        <InfoCard
                            icon={<Calendar size={16} />}
                            label="Date of Birth"
                            value={user.dob || "N/A"}
                        />

                        <InfoCard
                            icon={<User size={16} />}
                            label="Gender"
                            value={
                                user.gender || "N/A"
                            }
                            capitalize
                        />

                        <InfoCard
                            icon={<ShieldCheck size={16} />}
                            label="Verification"
                            value={
                                user.profile_verification_status
                                    ? "Profile Verified"
                                    : "Not Verified"
                            }
                            valueClass={
                                user.profile_verification_status
                                    ? "text-[#15803D]"
                                    : "text-[#64748B]"
                            }
                        />
                    </div>
                </div>

                {/* ========================================
                    ACTION ERROR
                ======================================== */}

                {actionError && (
                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
                        <ShieldAlert
                            size={18}
                            className="mt-0.5 shrink-0 text-red-500"
                        />

                        <p className="text-[13px] font-medium leading-5 text-red-700">
                            {actionError}
                        </p>
                    </div>
                )}

                {/* ========================================
                    REQUEST DETAILS
                ======================================== */}

                <div className="mb-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">

                    <div className="flex items-center justify-between border-b border-[#EEF2F6] px-6 py-4.5">

                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EFF6FF]">
                                <FileText
                                    size={17}
                                    className="text-[#2563EB]"
                                />
                            </div>

                            <div>
                                <h2 className="text-[15px] font-semibold text-[#0F172A]">
                                    Request Details
                                </h2>

                                <p className="mt-0.5 text-[11px] text-[#94A3B8]">
                                    Review the submitted reactivation request
                                </p>
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-2 text-[12px] font-medium text-[#64748B]">
                            <Clock3 size={14} />
                            {formatDate(
                                request.createdAt
                            )}
                        </div>
                    </div>

                    <div className="p-6">

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                            <InfoCard
                                icon={<Hash size={16} />}
                                label="Request ID"
                                value={`#${request.request_id}`}
                            />

                            <InfoCard
                                icon={<User size={16} />}
                                label="User ID"
                                value={`#${request.user_id}`}
                            />

                            <InfoCard
                                icon={<Activity size={16} />}
                                label="Status"
                                customValue={
                                    <Tags
                                        text={getStatusLabel(
                                            request.status
                                        )}
                                        variant={
                                            getStatusVariant(
                                                request.status
                                            ) as any
                                        }
                                    />
                                }
                            />

                            <InfoCard
                                icon={<Clock3 size={16} />}
                                label="Requested At"
                                value={`${formatDate(
                                    request.createdAt
                                )} ${formatTime(
                                    request.createdAt
                                )}`}
                            />
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-5">

                            <NoteBox
                                title="Request Note"
                                icon={
                                    <MessageSquareText
                                        size={16}
                                    />
                                }
                                text={
                                    request.request_note ||
                                    "No request note provided."
                                }
                            />

                            {request.admin_note && (
                                <NoteBox
                                    title="Admin Note"
                                    icon={
                                        <ShieldCheck
                                            size={16}
                                        />
                                    }
                                    text={
                                        request.admin_note
                                    }
                                />
                            )}
                        </div>

                        {/* ACTIONS */}

                        {request.status === "pending" && (
                            <div className="mt-6 flex flex-col gap-3 border-t border-[#EEF2F6] pt-6 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsRejectModalOpen(
                                            true
                                        )
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                    className="inline-flex h-[42px] items-center justify-center gap-2 rounded-lg border border-[#FCA5A5] bg-white px-5 text-[13px] font-semibold text-[#DC2626] transition hover:bg-[#FEF2F2] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <XCircle size={16} />
                                    Reject Request
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsApproveModalOpen(
                                            true
                                        )
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                    className="inline-flex h-[42px] items-center justify-center gap-2 rounded-lg bg-[#16A34A] px-5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#15803D] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <CheckCircle2
                                        size={16}
                                    />
                                    Approve Request
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ========================================
                    CONTENT SUMMARY
                ======================================== */}

                <div className="mb-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">

                    <SectionHeader
                        title="Content Summary"
                        subtitle="Overview of the creator's content"
                    />

                    <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">

                        <StatCard
                            icon={
                                <FileText size={19} />
                            }
                            label="Total Posts"
                            value={
                                content.total_posts
                            }
                        />

                        <StatCard
                            icon={
                                <Activity size={19} />
                            }
                            label="Total Reels"
                            value={
                                content.total_reels
                            }
                        />
                    </div>
                </div>

                {/* ========================================
                    MODERATION SUMMARY
                ======================================== */}

                <div className="mb-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">

                    <SectionHeader
                        title="Moderation Summary"
                        subtitle="Content moderation overview"
                    />

                    <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3">

                        <StatCard
                            icon={
                                <ShieldAlert size={19} />
                            }
                            label="Reports"
                            value={
                                moderation.reports
                                    .length
                            }
                        />

                        <StatCard
                            icon={
                                <XCircle size={19} />
                            }
                            label="Removed Content"
                            value={
                                moderation
                                    .removed_content
                                    .length
                            }
                        />

                        <StatCard
                            icon={
                                <Clock3 size={19} />
                            }
                            label="Archived Content"
                            value={
                                moderation
                                    .archived_content
                                    .length
                            }
                        />
                    </div>
                </div>

                {/* ========================================
                    MODALS
                ======================================== */}

                <ActivationModal
                    isOpen={isApproveModalOpen}
                    title="Approve Reactivation Request"
                    description="Approve this request and reactivate the user's account."
                    actionLabel="Approve Request"
                    placeholder="Enter admin note (optional)..."
                    reasonLabel="Admin Note"
                    requiredReason={false}
                    loading={actionLoading}
                    onClose={() =>
                        setIsApproveModalOpen(false)
                    }
                    onConfirm={handleApprove}
                />

                <ActivationModal
                    isOpen={isRejectModalOpen}
                    title="Reject Reactivation Request"
                    description="Reject this account reactivation request."
                    actionLabel="Reject Request"
                    placeholder="Enter admin note..."
                    reasonLabel="Admin Note"
                    requiredReason={true}
                    loading={actionLoading}
                    onClose={() =>
                        setIsRejectModalOpen(false)
                    }
                    onConfirm={handleReject}
                />
            </div>
        </div>
    );
};

/*
 * ==========================================
 * REUSABLE UI COMPONENTS
 * ==========================================
 */

interface InfoCardProps {
    icon: React.ReactNode;
    label: string;
    value?: string;
    customValue?: React.ReactNode;
    capitalize?: boolean;
    valueClass?: string;
}

const InfoCard = ({
    icon,
    label,
    value,
    customValue,
    capitalize,
    valueClass = "text-[#334155]",
}: InfoCardProps) => {
    return (
        <div className="rounded-xl border border-[#E8EDF3] bg-[#FAFBFC] px-4 py-3.5 transition hover:border-[#D7E2F0] hover:bg-white">

            <div className="flex items-center gap-2">
                <span className="text-[#94A3B8]">
                    {icon}
                </span>

                <p className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[#94A3B8]">
                    {label}
                </p>
            </div>

            {customValue ? (
                <div className="mt-2">
                    {customValue}
                </div>
            ) : (
                <p
                    className={`mt-1.5 text-[13px] font-semibold ${valueClass} ${capitalize
                        ? "capitalize"
                        : ""
                        }`}
                >
                    {value || "N/A"}
                </p>
            )}
        </div>
    );
};

interface NoteBoxProps {
    title: string;
    icon: React.ReactNode;
    text: string;
}

const NoteBox = ({
    title,
    icon,
    text,
}: NoteBoxProps) => {
    return (
        <div className="rounded-xl border border-[#E8EDF3] bg-[#FAFBFC] p-4.5">

            <div className="flex items-center gap-2 text-[#64748B]">
                {icon}

                <p className="text-[11px] font-semibold uppercase tracking-[0.07em]">
                    {title}
                </p>
            </div>

            <p className="mt-2.5 text-[13px] leading-6 text-[#475569]">
                {text}
            </p>
        </div>
    );
};

interface SectionHeaderProps {
    title: string;
    subtitle: string;
}

const SectionHeader = ({
    title,
    subtitle,
}: SectionHeaderProps) => {
    return (
        <div className="flex items-center gap-3 border-b border-[#EEF2F6] px-6 py-4.5">

            <div className="h-8 w-1 rounded-full bg-[#2563EB]" />

            <div>
                <h2 className="text-[15px] font-semibold text-[#0F172A]">
                    {title}
                </h2>

                <p className="mt-0.5 text-[11px] text-[#94A3B8]">
                    {subtitle}
                </p>
            </div>
        </div>
    );
};

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
}

const StatCard = ({
    icon,
    label,
    value,
}: StatCardProps) => {
    return (
        <div className="group relative overflow-hidden rounded-xl border border-[#E8EDF3] bg-[#FAFBFC] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#CBDCF5] hover:bg-white hover:shadow-[0_6px_20px_rgba(15,23,42,0.06)]">

            <div className="flex items-start justify-between">

                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#94A3B8]">
                        {label}
                    </p>

                    <p className="mt-2 text-[28px] font-bold tracking-[-0.02em] text-[#0F172A]">
                        {value}
                    </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB] transition group-hover:bg-[#DBEAFE]">
                    {icon}
                </div>
            </div>

            <div className="absolute -bottom-8 -right-8 h-20 w-20 rounded-full bg-[#EFF6FF] opacity-50 transition group-hover:scale-125" />
        </div>
    );
};

export default ReactivationRequestView;