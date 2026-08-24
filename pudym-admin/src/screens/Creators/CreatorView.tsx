"use client";

import {
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ShieldCheck,
    CreditCard,
    Building2,
    Coins,
    Users,
    FileText,
    IdCard,
    CheckCircle2,
    Clock3,
    Globe2,
} from "lucide-react";

import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

import {
    fetchCreatorDetails,
    clearSelectedCreator,
} from "@/store/slices/CreatorsSlices/creatorsSlice";

import Tags from "@/components/common/Tags";
import DateTime from "@/components/common/DateTime";


const CreatorView = () => {

    const router = useRouter();

    const searchParams =
        useSearchParams();

    const dispatch =
        useAppDispatch();

    const userId =
        searchParams.get("user_id");


    const {
        selectedCreator,
        detailsLoading,
        detailsError,
    } = useAppSelector(
        (state) => state.creators
    );


    const [
        imageError,
        setImageError,
    ] = useState(false);


    /*
     * ==========================================
     * FETCH CREATOR DETAILS
     * ==========================================
     */

    useEffect(() => {

        if (!userId) {
            return;
        }

        const parsedUserId =
            Number(userId);

        if (
            Number.isNaN(parsedUserId)
        ) {
            return;
        }

        setImageError(false);

        dispatch(
            fetchCreatorDetails(
                parsedUserId
            )
        );

        return () => {
            dispatch(
                clearSelectedCreator()
            );
        };

    }, [
        dispatch,
        userId,
    ]);


    /*
     * ==========================================
     * LOADING
     * ==========================================
     */

    if (detailsLoading) {

        return (
            <div className="px-5 py-5 md:px-6 lg:px-7">

                <div className="mb-6 h-5 w-32 animate-pulse rounded bg-[#EAECF0]" />

                <div className="mb-6 h-8 w-64 animate-pulse rounded bg-[#EAECF0]" />

                <div className="mb-6 h-[170px] animate-pulse rounded-2xl border border-[#EAECF0] bg-white" />

                <div className="space-y-5">

                    <div className="h-[250px] animate-pulse rounded-2xl border border-[#EAECF0] bg-white" />

                    <div className="h-[220px] animate-pulse rounded-2xl border border-[#EAECF0] bg-white" />

                </div>

            </div>
        );
    }


    /*
     * ==========================================
     * ERROR
     * ==========================================
     */

    if (detailsError) {

        return (
            <div className="px-5 py-5 md:px-6 lg:px-7">

                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-[14px] font-medium text-[#475467] transition hover:text-[#101828]"
                >
                    <ArrowLeft size={17} />

                    Back to Creators
                </button>


                <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-[#EAECF0] bg-white">

                    <div className="text-center">

                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">

                            <ShieldCheck
                                size={22}
                                className="text-red-500"
                            />

                        </div>

                        <p className="text-[16px] font-semibold text-[#101828]">
                            Unable to load creator
                        </p>

                        <p className="mt-1 text-[13px] text-[#667085]">
                            {detailsError}
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    /*
     * ==========================================
     * CREATOR NOT FOUND
     * ==========================================
     */

    if (!selectedCreator) {

        return (
            <div className="px-5 py-5 md:px-6 lg:px-7">

                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-[14px] font-medium text-[#475467] transition hover:text-[#101828]"
                >
                    <ArrowLeft size={17} />

                    Back to Creators
                </button>


                <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-[#EAECF0] bg-white">

                    <div className="text-center">

                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF]">

                            <User
                                size={22}
                                className="text-[#2563EB]"
                            />

                        </div>

                        <p className="text-[16px] font-semibold text-[#101828]">
                            Creator not found
                        </p>

                        <p className="mt-1 text-[13px] text-[#667085]">
                            The requested creator could not be found.
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    const creator =
        selectedCreator;


    /*
     * ==========================================
     * HELPERS
     * ==========================================
     */

    const displayValue = (
        value: string | null | undefined
    ) => {

        if (
            value === null ||
            value === undefined ||
            !String(value).trim()
        ) {
            return "N/A";
        }

        return value;
    };


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

        return Number(
            coins
        ).toLocaleString("en-IN");
    };


    const getCreatorName = () => {

        return (
            creator.full_name ||
            `${creator.first_name || ""} ${creator.last_name || ""}`.trim() ||
            "Unknown Creator"
        );
    };


    const getAvatarText = () => {

        const name =
            getCreatorName();

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

        return (
            words[0]
                ?.slice(0, 2)
                .toUpperCase() ||
            "CR"
        );
    };


    const username =
        creator.user_name
            ? `@${creator.user_name.replace(
                /^@/,
                ""
            )}`
            : "N/A";


    const location = [
        creator.city,
        creator.state,
        creator.country,
    ]
        .filter(Boolean)
        .join(", ");


    /*
     * ==========================================
     * RENDER
     * ==========================================
     */

    return (
        <div className="px-5 py-5 md:px-6 lg:px-7">

            {/* ========================================
                BACK
            ======================================== */}

            <button
                type="button"
                onClick={() => router.back()}
                className="mb-5 flex items-center gap-1.5 text-[13px] font-medium text-[#667085] transition-colors hover:text-[#101828]"
            >
                <ArrowLeft size={15} />
                Back to Creators
            </button>


            {/* ========================================
                PAGE HEADER
            ======================================== */}

            <div className="mb-6">
                <h1 className="text-[26px] font-bold tracking-[-0.02em] text-[#101828]">
                    Creator Details
                </h1>
                <p className="mt-1 text-[13.5px] text-[#667085]">
                    View creator profile, verification and account information.
                </p>
            </div>


            {/* ========================================
                PROFILE HERO
            ======================================== */}

            <div className="mb-6 overflow-hidden rounded-2xl border border-[#EAECF0] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)]">

                {/* Banner */}
                <div className="h-[100px] bg-gradient-to-r from-[#DBEAFE] via-[#EDE9FE] to-[#E0E7FF]" />

                <div className="px-6 pb-6">

                    <div className="-mt-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

                        {/* PROFILE */}
                        <div className="flex items-end gap-4">

                            {/* AVATAR */}
                            <div className="relative shrink-0">
                                {creator.profile_pic && !imageError ? (
                                    <img
                                        src={creator.profile_pic}
                                        alt={getCreatorName()}
                                        className="h-[96px] w-[96px] rounded-full border-4 border-white object-cover shadow-[0_4px_12px_rgba(16,24,40,0.15)]"
                                        onError={() => setImageError(true)}
                                    />
                                ) : (
                                    <div className="flex h-[96px] w-[96px] items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-[24px] font-bold text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)]">
                                        {getAvatarText()}
                                    </div>
                                )}

                                {/* online dot */}
                                {!creator.is_deactivated && (
                                    <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                                )}
                            </div>

                            {/* NAME */}
                            <div className="pb-1">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <h2 className="text-[20px] font-bold tracking-[-0.015em] text-[#101828]">
                                        {getCreatorName()}
                                    </h2>
                                    {creator.is_deactivated ? (
                                        <Tags text="Deactivated" variant="red" />
                                    ) : (
                                        <Tags text="Active" variant="emerald" />
                                    )}
                                </div>
                                <p className="mt-0.5 text-[13px] font-medium text-[#667085]">
                                    {username}
                                </p>
                                {location && (
                                    <p className="mt-1 flex items-center gap-1 text-[12px] text-[#98A2B3]">
                                        <MapPin size={12} />
                                        {location}
                                    </p>
                                )}
                            </div>

                        </div>


                        {/* SUMMARY CARDS */}
                        <div className="flex flex-wrap gap-3 lg:pb-1">

                            <SummaryCard
                                icon={<Coins size={16} />}
                                label="Available Coins"
                                value={formatCoins(creator.available_coins)}
                                accent="blue"
                            />

                            <SummaryCard
                                icon={<Users size={16} />}
                                label="Social Profiles"
                                value={creator.total_socials ?? 0}
                                accent="purple"
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* ========================================
                BASIC INFORMATION
            ======================================== */}

            <DetailSection
                title="Basic Information"
                description="Personal information associated with this creator account."
                icon={<User size={17} />}
            >

                <DetailItem
                    label="Full Name"
                    value={displayValue(
                        creator.full_name
                    )}
                />

                <DetailItem
                    label="Username"
                    value={username}
                />

                <DetailItem
                    label="Email"
                    value={displayValue(
                        creator.email
                    )}
                    icon={<Mail size={15} />}
                />

                <DetailItem
                    label="Mobile"
                    value={
                        creator.mobile_num
                            ? `${creator.country_code || ""} ${creator.mobile_num}`.trim()
                            : "N/A"
                    }
                    icon={<Phone size={15} />}
                />

                <DetailItem
                    label="Gender"
                    value={displayValue(
                        creator.gender
                    )}
                />

                <DetailItem
                    label="Date of Birth"
                    value={displayValue(
                        creator.dob
                    )}
                    icon={<Calendar size={15} />}
                />

            </DetailSection>


            {/* ========================================
                LOCATION
            ======================================== */}

            <DetailSection
                title="Location"
                description="Geographical information provided by the creator."
                icon={<MapPin size={17} />}
            >

                <DetailItem
                    label="Country"
                    value={displayValue(
                        creator.country
                    )}
                    icon={<Globe2 size={15} />}
                />

                <DetailItem
                    label="State"
                    value={displayValue(
                        creator.state
                    )}
                />

                <DetailItem
                    label="City"
                    value={displayValue(
                        creator.city
                    )}
                />

                <DetailItem
                    label="Full Location"
                    value={
                        location || "N/A"
                    }
                />

            </DetailSection>


            {/* ========================================
                IDENTITY
            ======================================== */}

            <DetailSection
                title="Identity Verification"
                description="Verification information submitted by the creator."
                icon={<IdCard size={17} />}
            >

                <VerificationItem
                    label="ID Proof"
                    verified={Boolean(
                        creator.id_proof
                    )}
                    value={
                        creator.id_proof
                            ? "Document uploaded"
                            : "Not provided"
                    }
                />

                <VerificationItem
                    label="Selfie"
                    verified={Boolean(
                        creator.selfie
                    )}
                    value={
                        creator.selfie
                            ? "Selfie uploaded"
                            : "Not provided"
                    }
                />

                <VerificationItem
                    label="Profile Verification"
                    verified={
                        creator.profile_verification_status
                    }
                    value={
                        creator.profile_verification_status
                            ? "Verified"
                            : "Not verified"
                    }
                />

            </DetailSection>


            {/* ========================================
                PAYMENT
            ======================================== */}

            <DetailSection
                title="Payment Information"
                description="Payment and payout information associated with the creator."
                icon={<CreditCard size={17} />}
            >

                <DetailItem
                    label="Name"
                    value={displayValue(
                        creator.name
                    )}
                />

                <DetailItem
                    label="CPF"
                    value={displayValue(
                        creator.cpf
                    )}
                />

                <DetailItem
                    label="Payment Type"
                    value={displayValue(
                        creator.payment_type
                    )}
                />

                <DetailItem
                    label="PIX Key"
                    value={displayValue(
                        creator.pix_key
                    )}
                />

                <DetailItem
                    label="Address"
                    value={displayValue(
                        creator.address
                    )}
                    fullWidth
                />

            </DetailSection>


            {/* ========================================
                COMPANY
            ======================================== */}

            <DetailSection
                title="Company Information"
                description="Business information provided as part of the creator profile."
                icon={<Building2 size={17} />}
            >

                <DetailItem
                    label="Company Name"
                    value={displayValue(
                        creator.company_name
                    )}
                />

                <DetailItem
                    label="CNPJ"
                    value={displayValue(
                        creator.cnpj
                    )}
                />

                <DetailItem
                    label="Company Address"
                    value={displayValue(
                        creator.company_address
                    )}
                    fullWidth
                />

            </DetailSection>


            {/* ========================================
                CREATOR APPLICATION
            ======================================== */}

            <DetailSection
                title="Creator Application"
                description="Application and administrative information."
                icon={<FileText size={17} />}
            >

                <DetailItem
                    label="Role"
                    value={displayValue(
                        creator.role
                    )}
                />

                <DetailItem
                    label="Admin Status"
                    value={
                        creator.admin_approve === "1"
                            ? "Approved"
                            : displayValue(
                                creator.admin_approve
                            )
                    }
                />

                <DetailItem
                    label="Admin Message"
                    value={displayValue(
                        creator.admin_text
                    )}
                    fullWidth
                />

                <DetailItem
                    label="Purpose"
                    value={displayValue(
                        creator.purpose_description
                    )}
                    fullWidth
                />

            </DetailSection>


            {/* ========================================
                ACCOUNT
            ======================================== */}

            <DetailSection
                title="Account Information"
                description="Current account state and system timestamps."
                icon={<ShieldCheck size={17} />}
            >

                <VerificationItem
                    label="Account Status"
                    verified={!creator.is_deactivated}
                    value={
                        creator.is_deactivated
                            ? "Deactivated"
                            : "Active"
                    }
                />

                <VerificationItem
                    label="Profile Verification"
                    verified={
                        creator.profile_verification_status
                    }
                    value={
                        creator.profile_verification_status
                            ? "Verified"
                            : "Not verified"
                    }
                />

                <DetailItem
                    label="Created At"
                    value={
                        <DateTime
                            date={formatDate(
                                creator.createdAt
                            )}
                            time={formatTime(
                                creator.createdAt
                            )}
                        />
                    }
                    icon={<Clock3 size={15} />}
                />

                <DetailItem
                    label="Updated At"
                    value={
                        <DateTime
                            date={formatDate(
                                creator.updatedAt
                            )}
                            time={formatTime(
                                creator.updatedAt
                            )}
                        />
                    }
                    icon={<Clock3 size={15} />}
                />

            </DetailSection>


            {/* BOTTOM SPACE */}

            <div className="h-3" />

        </div>
    );
};


/*
 * ==========================================
 * SUMMARY CARD
 * ==========================================
 */

interface SummaryCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    accent?: "blue" | "purple";
}

const accentStyles = {
    blue: {
        icon: "bg-[#EFF6FF] text-[#2563EB]",
        value: "text-[#2563EB]",
    },
    purple: {
        icon: "bg-[#F5F3FF] text-[#7C3AED]",
        value: "text-[#7C3AED]",
    },
} as const;

const SummaryCard = ({
    icon,
    label,
    value,
    accent = "blue",
}: SummaryCardProps) => {

    const styles = accentStyles[accent];

    return (
        <div className="min-w-[148px] rounded-xl border border-[#EAECF0] bg-white px-4 py-3.5 shadow-[0_1px_3px_rgba(16,24,40,0.05)]">

            <div className="flex items-center gap-2">
                <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${styles.icon}`}>
                    {icon}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#98A2B3]">
                    {label}
                </span>
            </div>

            <p className={`mt-2 text-[20px] font-bold ${styles.value}`}>
                {value}
            </p>

        </div>
    );
};


/*
 * ==========================================
 * DETAIL SECTION
 * ==========================================
 */

interface DetailSectionProps {
    title: string;
    description: string;
    icon: ReactNode;
    children: ReactNode;
}

const DetailSection = ({
    title,
    description,
    icon,
    children,
}: DetailSectionProps) => {

    return (
        <div className="mb-5 overflow-hidden rounded-2xl border border-[#EAECF0] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)]">

            <div className="flex items-center gap-3 border-b border-[#EAECF0] bg-[#FAFAFA] px-6 py-4">

                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                    {icon}
                </span>

                <div>
                    <h3 className="text-[13.5px] font-semibold text-[#101828]">
                        {title}
                    </h3>
                    <p className="mt-0.5 text-[11.5px] text-[#98A2B3]">
                        {description}
                    </p>
                </div>

            </div>

            <div className="grid grid-cols-1 divide-y divide-[#F2F4F7] md:grid-cols-2 md:divide-y-0">
                {children}
            </div>

        </div>
    );
};


/*
 * ==========================================
 * DETAIL ITEM
 * ==========================================
 */

interface DetailItemProps {
    label: string;
    value: ReactNode;
    icon?: ReactNode;
    fullWidth?: boolean;
}

const DetailItem = ({
    label,
    value,
    icon,
    fullWidth = false,
}: DetailItemProps) => {

    return (
        <div
            className={
                `px-6 py-4 ${
                    fullWidth ? "md:col-span-2 border-t border-[#F2F4F7]" : ""
                }`
            }
        >
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#98A2B3]">
                {label}
            </p>

            <div className="flex items-center gap-1.5 text-[13.5px] font-medium text-[#344054]">
                {icon && (
                    <span className="shrink-0 text-[#98A2B3]">
                        {icon}
                    </span>
                )}
                <span className="break-words">
                    {value}
                </span>
            </div>

        </div>
    );
};


/*
 * ==========================================
 * VERIFICATION ITEM
 * ==========================================
 */

interface VerificationItemProps {
    label: string;
    value: string;
    verified: boolean;
}

const VerificationItem = ({
    label,
    value,
    verified,
}: VerificationItemProps) => {

    return (
        <div className="px-6 py-4">

            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#98A2B3]">
                {label}
            </p>

            <span
                className={
                    verified
                        ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-emerald-700"
                        : "inline-flex items-center gap-1.5 rounded-full bg-[#F2F4F7] px-2.5 py-1 text-[12px] font-semibold text-[#667085]"
                }
            >
                {verified ? (
                    <CheckCircle2 size={13} className="shrink-0" />
                ) : (
                    <Clock3 size={13} className="shrink-0" />
                )}
                {value}
            </span>

        </div>
    );
};


export default CreatorView;