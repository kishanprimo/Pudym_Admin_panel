"use client";

import { useEffect, useState } from "react";

import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    CalendarDays,
    BriefcaseBusiness,
    CreditCard,
    FileCheck,
    ShieldCheck,
    Clock3,
    CircleCheck,
    CircleX,
    Loader2,
    Image as ImageIcon,
    ExternalLink,
    Building2,
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
    fetchCreatorRequestDetails,
    changeCreatorRequestStatus,
} from "@/store/slices/CreatorRequestsSlices/creatorRequestsSlice";
import { toast } from "react-toastify";
import Tags from "@/components/common/Tags";

export default function CreatorRequestView() {

    const router = useRouter();

    const searchParams =
        useSearchParams();

    const dispatch =
        useAppDispatch();

    const userId =
        searchParams.get("user_id");

    const {
        selectedRequest,
        detailsLoading,
        detailsError,

        statusError,
    } = useAppSelector(
        (state) =>
            state.creatorRequests
    );


    const [
        profileImageError,
        setProfileImageError,
    ] = useState(false);
    const [
        adminNote,
        setAdminNote,
    ] = useState("");

    const [
        selectedStatus,
        setSelectedStatus,
    ] = useState<
        "under_review" |
        "pending" |
        "approved" |
        "rejected"
    >("under_review");
    const [
        updatingStatus,
        setUpdatingStatus,
    ] = useState<
        "under_review" |
        "pending" |
        "approved" |
        "rejected" |
        null
    >(null);
    /*
     * ==========================================
     * FETCH DETAILS
     * ==========================================
     */

    useEffect(() => {

        if (!userId) {
            return;
        }

        dispatch(
            fetchCreatorRequestDetails(
                Number(userId)
            )
        );

    }, [
        dispatch,
        userId,
    ]);

    useEffect(() => {
        if (!selectedRequest) {
            return;
        }

        setAdminNote(
            selectedRequest.admin_text || ""
        );

        setSelectedStatus(
            selectedRequest.status
        );
    }, [selectedRequest]);

    const handleStatusUpdate = async (
        newStatus:
            | "under_review"
            | "pending"
            | "approved"
            | "rejected"
    ) => {
        if (!userId || !selectedRequest) {
            return;
        }

        /*
         * Pending and rejected require
         * an admin message.
         */
        if (
            (newStatus === "pending" ||
                newStatus === "rejected") &&
            !adminNote.trim()
        ) {
            toast.error(
                newStatus === "rejected"
                    ? "Admin note is required when rejecting a request."
                    : "Admin note is required when putting a request in pending."
            );

            return;
        }

        setUpdatingStatus(newStatus);

        try {
            const result = await dispatch(
                changeCreatorRequestStatus({
                    userId: Number(userId),
                    status: newStatus,
                    admin_text: adminNote.trim(),
                })
            );

            if (
                changeCreatorRequestStatus.fulfilled.match(
                    result
                )
            ) {
                setSelectedStatus(newStatus);

                toast.success(
                    `Creator request ${newStatus.replace(
                        "_",
                        " "
                    )} successfully.`
                );
            } else {
                toast.error(
                    result.payload ||
                    "Failed to update creator request status."
                );
            }
        } finally {
            setUpdatingStatus(null);
        }
    };
    /*
     * ==========================================
     * FORMATTERS
     * ==========================================
     */

    const formatValue = (
        value:
            | string
            | number
            | null
            | undefined
    ) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "N/A";
        }

        return String(value);
    };


    const capitalize = (
        value?: string | null
    ) => {

        if (!value) {
            return "N/A";
        }

        return (
            value.charAt(0).toUpperCase() +
            value.slice(1)
        );
    };


    const formatDate = (
        date?: string | null
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
        date?: string | null
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


    /*
     * ==========================================
     * STATUS
     * ==========================================
     */

    const getStatusVariant = (
        status?: string
    ):
        | "blue"
        | "orange"
        | "green"
        | "red"
        | "gray" => {

        switch (status) {

            case "under_review":
                return "blue";

            case "pending":
                return "orange";

            case "approved":
                return "green";

            case "rejected":
                return "red";

            default:
                return "gray";
        }
    };


    const getStatusLabel = (
        status?: string
    ) => {

        switch (status) {

            case "under_review":
                return "Under Review";

            case "pending":
                return "Pending";

            case "approved":
                return "Approved";

            case "rejected":
                return "Rejected";

            default:
                return "N/A";
        }
    };


    /*
     * ==========================================
     * INITIALS
     * ==========================================
     */

    const getInitials = () => {

        if (!selectedRequest) {
            return "CR";
        }

        const name =
            selectedRequest.full_name ||
            selectedRequest.user_name ||
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
                words[0][0] +
                words[1][0]
            ).toUpperCase();
        }

        return words[0]
            ?.slice(0, 2)
            .toUpperCase() || "CR";
    };


    /*
     * ==========================================
     * LOADING
     * ==========================================
     */

    if (detailsLoading) {

        return (
            <CreatorRequestViewSkeleton />
        );
    }


    /*
     * ==========================================
     * ERROR
     * ==========================================
     */

    if (
        detailsError ||
        !selectedRequest
    ) {

        return (
            <div className="min-h-full px-5 py-5 md:px-6 lg:px-7">

                <button
                    type="button"
                    onClick={() =>
                        router.back()
                    }
                    className="mb-6 flex cursor-pointer items-center gap-2 text-[13px] font-medium text-[#667085] transition-colors hover:text-[#101828]"
                >
                    <ArrowLeft
                        size={16}
                    />

                    Back to Creator Requests
                </button>


                <div className="flex min-h-[450px] items-center justify-center rounded-[16px] border border-[#EAECF0] bg-white">

                    <div className="text-center">

                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">

                            <FileCheck
                                size={26}
                                className="text-red-500"
                            />

                        </div>


                        <h2 className="text-[18px] font-semibold text-[#101828]">
                            Unable to load creator request
                        </h2>


                        <p className="mt-2 text-[14px] text-[#667085]">
                            {detailsError ||
                                "Creator request could not be found."}
                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                router.back()
                            }
                            className="mt-5 rounded-[8px] bg-[#2563EB] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-blue-700"
                        >
                            Back to Creator Requests
                        </button>

                    </div>

                </div>

            </div>
        );
    }


    const request =
        selectedRequest;


    const status =
        getStatusLabel(
            request.status
        );


    const statusVariant =
        getStatusVariant(
            request.status
        );


    const isCompany =
        request.payment_type ===
        "company";


    return (
        <div className="min-h-full px-5 py-5 md:px-6 lg:px-7">

            {/* ========================================
                BACK
            ======================================== */}

            <button
                type="button"
                onClick={() =>
                    router.back()
                }
                className="mb-6 flex cursor-pointer items-center gap-2 text-[13px] font-medium text-[#667085] transition-colors hover:text-[#101828]"
            >

                <ArrowLeft
                    size={16}
                />

                Back to Creator Requests

            </button>


            {/* ========================================
    PAGE TITLE + STATUS ACTIONS
======================================== */}

            <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                {/* TITLE */}

                <div className="min-w-0">

                    <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#101828]">
                        Creator Request
                    </h1>

                    <p className="mt-1 text-[14px] text-[#667085]">
                        Review the creator's application and verification information.
                    </p>

                </div>


                {/* STATUS ACTIONS */}

                <div className="flex flex-wrap items-center gap-2 lg:justify-end">

                    {/* REJECT */}

                    <button
                        type="button"
                        disabled={
                            updatingStatus !== null
                        }
                        onClick={() =>
                            handleStatusUpdate(
                                "rejected"
                            )
                        }
                        className="inline-flex h-[40px] items-center justify-center gap-2 rounded-[9px] border border-red-200 bg-red-50 px-4 text-[13px] font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        {updatingStatus === "rejected" ? (
                            <Loader2
                                size={15}
                                className="animate-spin"
                            />
                        ) : (
                            <CircleX
                                size={15}
                            />
                        )}

                        Reject

                    </button>


                    {/* PENDING */}

                    <button
                        type="button"
                        disabled={
                            updatingStatus !== null
                        }
                        onClick={() =>
                            handleStatusUpdate(
                                "pending"
                            )
                        }
                        className="inline-flex h-[40px] items-center justify-center gap-2 rounded-[9px] border border-orange-200 bg-orange-50 px-4 text-[13px] font-semibold text-orange-600 transition-colors hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        {updatingStatus === "pending" ? (
                            <Loader2
                                size={15}
                                className="animate-spin"
                            />
                        ) : (
                            <Clock3
                                size={15}
                            />
                        )}

                        Pending

                    </button>


                    {/* UNDER REVIEW */}

                    <button
                        type="button"
                        disabled={
                            updatingStatus !== null
                        }
                        onClick={() =>
                            handleStatusUpdate(
                                "under_review"
                            )
                        }
                        className="inline-flex h-[40px] items-center justify-center gap-2 rounded-[9px] border border-blue-200 bg-blue-50 px-4 text-[13px] font-semibold text-blue-600 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        {updatingStatus === "under_review" ? (
                            <Loader2
                                size={15}
                                className="animate-spin"
                            />
                        ) : (
                            <Clock3
                                size={15}
                            />
                        )}

                        Under Review

                    </button>


                    {/* APPROVE */}

                    <button
                        type="button"
                        disabled={
                            updatingStatus !== null
                        }
                        onClick={() =>
                            handleStatusUpdate(
                                "approved"
                            )
                        }
                        className="inline-flex h-[40px] items-center justify-center gap-2 rounded-[9px] bg-[#2563EB] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        {updatingStatus === "approved" ? (
                            <Loader2
                                size={15}
                                className="animate-spin"
                            />
                        ) : (
                            <CircleCheck
                                size={15}
                            />
                        )}

                        Approve

                    </button>

                </div>

            </div>

            
            {/* ========================================
                PROFILE HERO
            ======================================== */}

            <div className="mb-6 overflow-hidden rounded-[16px] border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03)]">

                <div className="h-[88px] bg-gradient-to-r from-[#EFF6FF] via-[#F5F8FF] to-[#F8FAFC]" />

                <div className="px-6 pb-6">

                    <div className="-mt-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

                        <div className="flex items-end gap-5">

                            {/* Avatar */}

                            {!profileImageError &&
                                request.profile_pic ? (

                                <img
                                    src={
                                        request.profile_pic
                                    }
                                    alt={
                                        request.full_name ||
                                        "Creator"
                                    }
                                    onError={() =>
                                        setProfileImageError(
                                            true
                                        )
                                    }
                                    className="h-24 w-24 shrink-0 rounded-full border-4 border-white bg-white object-cover shadow-sm"
                                />

                            ) : (

                                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#2563EB] text-[28px] font-semibold text-white shadow-sm">

                                    {getInitials()}

                                </div>

                            )}


                            <div className="pb-1">

                                <div className="flex flex-wrap items-center gap-2">

                                    <h2 className="text-[23px] font-semibold tracking-[-0.02em] text-[#101828]">

                                        {formatValue(
                                            request.full_name
                                        )}

                                    </h2>


                                    {request.profile_verification_status && (

                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50">

                                            <ShieldCheck
                                                size={15}
                                                className="text-[#2563EB]"
                                            />

                                        </span>

                                    )}

                                </div>


                                <p className="mt-1 text-[13px] text-[#667085]">

                                    {request.user_name
                                        ? `@${request.user_name.replace(
                                            /^@/,
                                            ""
                                        )}`
                                        : "N/A"}

                                </p>


                                <div className="mt-3 flex flex-wrap items-center gap-2">

                                    <Tags
                                        text={status}
                                        variant={
                                            statusVariant
                                        }
                                    />

                                    <Tags
                                        text="Creator Request"
                                        variant="purple"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* Request ID */}

                        <div className="rounded-[10px] border border-[#EAECF0] bg-[#F9FAFB] px-4 py-2.5">

                            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#98A2B3]">
                                User ID
                            </p>

                            <p className="mt-0.5 text-[14px] font-semibold text-[#101828]">
                                #{request.user_id}
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* ========================================
                APPLICATION INFORMATION
            ======================================== */}

            <InfoSection
                title="Personal Information"
                icon={
                    <User
                        size={18}
                    />
                }
            >

                <div className="grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-2 lg:grid-cols-3">

                    <InfoItem
                        label="Full Name"
                        value={formatValue(
                            request.full_name
                        )}
                    />

                    <InfoItem
                        label="First Name"
                        value={formatValue(
                            request.first_name
                        )}
                    />

                    <InfoItem
                        label="Last Name"
                        value={formatValue(
                            request.last_name
                        )}
                    />

                    <InfoItem
                        label="Date of Birth"
                        value={formatValue(
                            request.dob
                        )}
                        icon={
                            <CalendarDays
                                size={15}
                            />
                        }
                    />

                    <InfoItem
                        label="Gender"
                        value={capitalize(
                            request.gender
                        )}
                    />

                    <InfoItem
                        label="Username"
                        value={
                            request.user_name
                                ? `@${request.user_name.replace(
                                    /^@/,
                                    ""
                                )}`
                                : "N/A"
                        }
                    />

                </div>

            </InfoSection>


            {/* ========================================
                CONTACT INFORMATION
            ======================================== */}

            <InfoSection
                title="Contact Information"
                icon={
                    <Phone
                        size={18}
                    />
                }
            >

                <div className="grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-2 lg:grid-cols-3">

                    <InfoItem
                        label="Email"
                        value={formatValue(
                            request.email
                        )}
                        icon={
                            <Mail
                                size={15}
                            />
                        }
                    />

                    <InfoItem
                        label="Mobile Number"
                        value={
                            request.mobile_num
                                ? `${request.country_code || ""} ${request.mobile_num}`
                                : "N/A"
                        }
                        icon={
                            <Phone
                                size={15}
                            />
                        }
                    />

                    <InfoItem
                        label="Country"
                        value={formatValue(
                            request.country
                        )}
                        icon={
                            <MapPin
                                size={15}
                            />
                        }
                    />

                    <InfoItem
                        label="State"
                        value={formatValue(
                            request.state
                        )}
                    />

                    <InfoItem
                        label="City"
                        value={formatValue(
                            request.city
                        )}
                    />

                    <InfoItem
                        label="Address"
                        value={formatValue(
                            request.address
                        )}
                    />

                </div>

            </InfoSection>


            {/* ========================================
                PROFESSIONAL INFORMATION
            ======================================== */}

            <InfoSection
                title="Professional Information"
                icon={
                    <BriefcaseBusiness
                        size={18}
                    />
                }
            >

                {/* Purpose */}

                <div className="mb-7">

                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-[#98A2B3]">
                        Purpose
                    </p>

                    <div className="rounded-[10px] border border-[#EAECF0] bg-[#F9FAFB] px-4 py-4">

                        <p className="text-[14px] leading-6 text-[#475467]">

                            {request.purpose_description ||
                                "No purpose description provided."}

                        </p>

                    </div>

                </div>


                <div className="grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-2 lg:grid-cols-3">

                    <InfoItem
                        label="Payment Type"
                        value={capitalize(
                            request.payment_type
                        )}
                        icon={
                            <CreditCard
                                size={15}
                            />
                        }
                    />

                    <InfoItem
                        label="CPF"
                        value={formatValue(
                            request.cpf
                        )}
                    />

                    <InfoItem
                        label="PIX Key"
                        value={formatValue(
                            request.pix_key
                        )}
                    />

                    {isCompany && (
                        <>
                            <InfoItem
                                label="CNPJ"
                                value={formatValue(
                                    request.cnpj
                                )}
                            />

                            <InfoItem
                                label="Company Name"
                                value={formatValue(
                                    request.company_name
                                )}
                                icon={
                                    <Building2
                                        size={15}
                                    />
                                }
                            />

                            <InfoItem
                                label="Company Address"
                                value={formatValue(
                                    request.company_address
                                )}
                            />
                        </>
                    )}

                </div>

            </InfoSection>


            {/* ========================================
                VERIFICATION DOCUMENTS
            ======================================== */}

            <InfoSection
                title="Verification Documents"
                icon={
                    <FileCheck
                        size={18}
                    />
                }
            >

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <DocumentCard
                        title="ID Proof"
                        imageUrl={
                            request.id_proof
                        }
                    />

                    <DocumentCard
                        title="Selfie"
                        imageUrl={
                            request.selfie
                        }
                    />

                </div>

            </InfoSection>


            {/* ========================================
                ADMIN REVIEW
            ======================================== */}

            {/* ========================================
    ADMIN REVIEW
======================================== */}

            <InfoSection
                title="Admin Review"
                icon={
                    <ShieldCheck
                        size={18}
                    />
                }
                className="mb-2"
            >

                {/* STATUS + VERIFICATION */}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    {/* CURRENT STATUS */}

                    <div>

                        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.04em] text-[#98A2B3]">
                            Current Status
                        </p>

                        <Tags
                            text={getStatusLabel(
                                selectedStatus
                            )}
                            variant={getStatusVariant(
                                selectedStatus
                            )}
                        />

                    </div>


                    {/* PROFILE VERIFICATION */}

                    <div>

                        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.04em] text-[#98A2B3]">
                            Profile Verification
                        </p>

                        <div className="flex items-center gap-2">

                            {request.profile_verification_status ? (

                                <>
                                    <CircleCheck
                                        size={17}
                                        className="text-emerald-600"
                                    />

                                    <span className="text-[14px] font-medium text-emerald-600">
                                        Verified
                                    </span>
                                </>

                            ) : (

                                <>
                                    <CircleX
                                        size={17}
                                        className="text-gray-400"
                                    />

                                    <span className="text-[14px] font-medium text-[#667085]">
                                        Not Verified
                                    </span>
                                </>

                            )}

                        </div>

                    </div>

                </div>


                {/* ADMIN NOTE */}

                <div className="mt-7">

                    <div className="mb-2 flex items-center justify-between">

                        <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#98A2B3]">
                            Admin Note
                        </p>

                        <span className="text-[11px] text-[#98A2B3]">
                            {adminNote.length}/1000
                        </span>

                    </div>

                    <textarea
                        value={adminNote}
                        onChange={(event) =>
                            setAdminNote(
                                event.target.value.slice(
                                    0,
                                    1000
                                )
                            )
                        }
                        placeholder="Add a note for this creator..."
                        rows={4}
                        className="w-full resize-none rounded-[10px] border border-[#D0D5DD] bg-white px-4 py-3 text-[14px] leading-6 text-[#344054] outline-none transition-all placeholder:text-[#98A2B3] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
                    />

                </div>


                {/* STATUS ACTIONS */}

                <div className="mt-7">

                    <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.04em] text-[#98A2B3]">
                        Update Status
                    </p>

                    <div className="flex flex-wrap items-center gap-3">

                        {/* REJECT */}

                        <button
                            type="button"
                            disabled={
                                updatingStatus !== null
                            }
                            onClick={() =>
                                handleStatusUpdate(
                                    "rejected"
                                )
                            }
                            className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[9px] border border-red-200 bg-red-50 px-5 text-[13px] font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {updatingStatus === "rejected" ? (
                                <Loader2
                                    size={16}
                                    className="animate-spin"
                                />
                            ) : (
                                <CircleX
                                    size={16}
                                />
                            )}

                            Reject

                        </button>


                        {/* PENDING */}

                        <button
                            type="button"
                            disabled={
                                updatingStatus !== null
                            }
                            onClick={() =>
                                handleStatusUpdate(
                                    "pending"
                                )
                            }
                            className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[9px] border border-orange-200 bg-orange-50 px-5 text-[13px] font-semibold text-orange-600 transition-colors hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {updatingStatus === "pending" ? (
                                <Loader2
                                    size={16}
                                    className="animate-spin"
                                />
                            ) : (
                                <Clock3
                                    size={16}
                                />
                            )}

                            Pending

                        </button>


                        {/* UNDER REVIEW */}

                        <button
                            type="button"
                            disabled={
                                updatingStatus !== null
                            }
                            onClick={() =>
                                handleStatusUpdate(
                                    "under_review"
                                )
                            }
                            className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[9px] border border-blue-200 bg-blue-50 px-5 text-[13px] font-semibold text-blue-600 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {updatingStatus === "under_review" ? (
                                <Loader2
                                    size={16}
                                    className="animate-spin"
                                />
                            ) : (
                                <Clock3
                                    size={16}
                                />
                            )}

                            Under Review

                        </button>


                        {/* APPROVE */}

                        <button
                            type="button"
                            disabled={
                                updatingStatus !== null
                            }
                            onClick={() =>
                                handleStatusUpdate(
                                    "approved"
                                )
                            }
                            className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[9px] bg-[#2563EB] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {updatingStatus === "approved" ? (
                                <Loader2
                                    size={16}
                                    className="animate-spin"
                                />
                            ) : (
                                <CircleCheck
                                    size={16}
                                />
                            )}

                            Approve

                        </button>

                    </div>

                </div>


                {/* ERROR */}

                {statusError && (

                    <div className="mt-4 rounded-[9px] border border-red-200 bg-red-50 px-4 py-3">

                        <p className="text-[13px] font-medium text-red-600">
                            {statusError}
                        </p>

                    </div>

                )}


                {/* ACTIVITY */}

                <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">

                    <ActivityCard
                        icon={
                            <CalendarDays
                                size={18}
                            />
                        }
                        label="Submitted"
                        date={formatDate(
                            request.createdAt
                        )}
                        time={formatTime(
                            request.createdAt
                        )}
                        iconClass="bg-blue-50 text-blue-600"
                    />

                    <ActivityCard
                        icon={
                            <Clock3
                                size={18}
                            />
                        }
                        label="Last Updated"
                        date={formatDate(
                            request.updatedAt
                        )}
                        time={formatTime(
                            request.updatedAt
                        )}
                        iconClass="bg-emerald-50 text-emerald-600"
                    />

                </div>

            </InfoSection>

        </div>
    );
}


/*
 * ==========================================
 * INFO SECTION
 * ==========================================
 */

function InfoSection({
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
        <div
            className={`${className} overflow-hidden rounded-[14px] border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.02)]`}
        >

            <div className="flex items-center gap-3 border-b border-[#EAECF0] px-6 py-4">

                <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#EFF6FF] text-[#2563EB]">

                    {icon}

                </div>

                <h2 className="text-[15px] font-semibold text-[#101828]">

                    {title}

                </h2>

            </div>

            <div className="px-6 py-6">

                {children}

            </div>

        </div>
    );
}


/*
 * ==========================================
 * INFO ITEM
 * ==========================================
 */

function InfoItem({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon?: React.ReactNode;
}) {

    return (
        <div className="min-w-0">

            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-[#98A2B3]">
                {label}
            </p>

            <div className="flex items-center gap-2">

                {icon && (
                    <span className="shrink-0 text-[#667085]">
                        {icon}
                    </span>
                )}

                <p
                    className="truncate text-[14px] font-medium text-[#344054]"
                    title={value}
                >
                    {value}
                </p>

            </div>

        </div>
    );
}


/*
 * ==========================================
 * DOCUMENT CARD
 * ==========================================
 */

function DocumentCard({
    title,
    imageUrl,
}: {
    title: string;
    imageUrl?: string | null;
}) {

    const [
        imageError,
        setImageError,
    ] = useState(false);


    const hasImage =
        Boolean(imageUrl) &&
        !imageError;


    return (
        <div className="overflow-hidden rounded-[12px] border border-[#EAECF0] bg-white">

            <div className="flex items-center justify-between border-b border-[#EAECF0] px-4 py-3">

                <div className="flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#EFF6FF] text-[#2563EB]">

                        <ImageIcon
                            size={16}
                        />

                    </div>

                    <p className="text-[13px] font-semibold text-[#101828]">

                        {title}

                    </p>

                </div>

            </div>


            <div className="p-4">

                {hasImage ? (

                    <>

                        <div className="flex h-[250px] items-center justify-center overflow-hidden rounded-[10px] border border-[#EAECF0] bg-[#F9FAFB]">

                            <img
                                src={imageUrl!}
                                alt={title}
                                onError={() =>
                                    setImageError(
                                        true
                                    )
                                }
                                className="h-full w-full object-contain"
                            />

                        </div>


                        <a
                            href={imageUrl!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 flex items-center justify-center gap-2 rounded-[8px] border border-[#D0D5DD] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#344054] transition-colors hover:bg-[#F9FAFB]"
                        >

                            View Document

                            <ExternalLink
                                size={14}
                            />

                        </a>

                    </>

                ) : (

                    <div className="flex h-[250px] flex-col items-center justify-center rounded-[10px] border border-dashed border-[#D0D5DD] bg-[#F9FAFB]">

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">

                            <FileCheck
                                size={20}
                                className="text-gray-400"
                            />

                        </div>

                        <p className="mt-3 text-[13px] font-medium text-[#667085]">

                            No document uploaded

                        </p>

                    </div>

                )}

            </div>

        </div>
    );
}


/*
 * ==========================================
 * ACTIVITY CARD
 * ==========================================
 */

function ActivityCard({
    icon,
    label,
    date,
    time,
    iconClass,
}: {
    icon: React.ReactNode;
    label: string;
    date: string;
    time: string;
    iconClass: string;
}) {

    return (
        <div className="flex items-center gap-4 rounded-[11px] border border-[#EAECF0] bg-[#F9FAFB] px-4 py-4">

            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] ${iconClass}`}
            >
                {icon}
            </div>

            <div>

                <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#98A2B3]">

                    {label}

                </p>

                <div className="mt-1 flex flex-wrap items-center gap-2">

                    <span className="text-[14px] font-semibold text-[#344054]">

                        {date}

                    </span>

                    {time && (
                        <>
                            <span className="h-1 w-1 rounded-full bg-[#98A2B3]" />

                            <span className="text-[13px] text-[#667085]">

                                {time}

                            </span>
                        </>
                    )}

                </div>

            </div>

        </div>
    );
}


/*
 * ==========================================
 * SKELETON
 * ==========================================
 */

function CreatorRequestViewSkeleton() {

    return (
        <div className="min-h-full animate-pulse px-5 py-5 md:px-6 lg:px-7">

            <div className="mb-6 h-5 w-40 rounded bg-gray-200" />

            <div className="mb-6 h-7 w-52 rounded bg-gray-200" />

            {/* Hero */}

            <div className="mb-6 overflow-hidden rounded-[16px] border border-[#EAECF0] bg-white">

                <div className="h-[88px] bg-gray-100" />

                <div className="px-6 pb-6">

                    <div className="-mt-10 flex items-end gap-5">

                        <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-200" />

                        <div className="pb-1">

                            <div className="h-6 w-52 rounded bg-gray-200" />

                            <div className="mt-3 h-4 w-36 rounded bg-gray-100" />

                            <div className="mt-3 h-7 w-24 rounded-full bg-gray-200" />

                        </div>

                    </div>

                </div>

            </div>


            {[1, 2, 3, 4, 5].map(
                (section) => (

                    <div
                        key={section}
                        className="mb-6 rounded-[14px] border border-[#EAECF0] bg-white p-6"
                    >

                        <div className="mb-7 h-5 w-48 rounded bg-gray-200" />

                        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">

                            {[1, 2, 3, 4, 5, 6].map(
                                (field) => (

                                    <div
                                        key={field}
                                    >

                                        <div className="mb-2 h-3 w-24 rounded bg-gray-100" />

                                        <div className="h-4 w-40 rounded bg-gray-200" />

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                )
            )}

        </div>
    );
}