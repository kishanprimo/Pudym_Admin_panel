"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    CalendarDays,
    ShieldCheck,
    Coins,
    Globe,
    UserCheck,
    UserX,
    Clock3,
    CircleCheck,
    CircleX,
    LockKeyhole,
    BadgeCheck,
    Activity,
    ShieldAlert,
    Loader2,
    Fingerprint,
} from "lucide-react";
import {
    fetchUserDetails,
    changeUserBlockStatus,
    changeUserStatus,
} from "@/store/slices/AllUsersSlices/allUsersSlice";
import { toast } from "react-toastify";
import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";
import ActivationModal from "@/components/common/ActivationModal";
import Tags from "@/components/common/Tags";
import DateTime from "@/components/common/DateTime";

export default function UserView() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    const userId = searchParams.get("user_id");

    const {
        selectedUser,
        detailsLoading,
        detailsError,
        statusLoading,
        statusLoadingUserId,
        blockLoading,
        blockLoadingUserId,
    } = useAppSelector((state) => state.allUsers);

    const [imageError, setImageError] = useState(false);

    const [statusModalOpen, setStatusModalOpen] =
        useState(false);

    const [statusAction, setStatusAction] =
        useState<"activate" | "deactivate" | null>(null);

    const [blockModalOpen, setBlockModalOpen] =
        useState(false);
    /*
     * ==========================================
     * FETCH USER DETAILS
     * ==========================================
     */

    useEffect(() => {
        if (!userId) return;

        dispatch(fetchUserDetails(Number(userId)));
    }, [dispatch, userId]);
    const handleStatusAction = (
        action: "activate" | "deactivate"
    ) => {
        if (
            !selectedUser ||
            !userId ||
            statusLoading ||
            blockLoading
        ) {
            return;
        }

        // Blocked users cannot be activated/deactivated.
        if (selectedUser.blocked_by_admin) {
            return;
        }

        setStatusAction(action);
        setStatusModalOpen(true);
    };
    const handleStatusConfirm = async (
        reason: string
    ) => {
        if (
            !selectedUser ||
            !userId ||
            !statusAction ||
            statusLoading
        ) {
            return;
        }

        const isDeactivated =
            statusAction === "deactivate";

        const result = await dispatch(
            changeUserStatus({
                userId: Number(userId),
                is_deactivated: isDeactivated,
                reason,
            })
        );

        if (changeUserStatus.fulfilled.match(result)) {
            toast.success(
                isDeactivated
                    ? "User deactivated successfully"
                    : "User activated successfully"
            );

            setStatusModalOpen(false);
            setStatusAction(null);
        } else {
            toast.error(
                result.payload ||
                "Failed to update user status"
            );
        }
    };
    /*
 * ==========================================
 * BLOCK / UNBLOCK USER
 * ==========================================
 */

    const handleBlockToggle = () => {
        if (!selectedUser || !userId || blockLoading) {
            return;
        }

        setBlockModalOpen(true);
    };
    const handleBlockConfirm = async (
        reason: string
    ) => {
        if (!selectedUser || !userId || blockLoading) {
            return;
        }

        const shouldBlock =
            !selectedUser.blocked_by_admin;

        const result = await dispatch(
            changeUserBlockStatus({
                userId: Number(userId),
                blocked_by_admin: shouldBlock,
                reason,
            })
        );

        if (changeUserBlockStatus.fulfilled.match(result)) {
            toast.success(
                shouldBlock
                    ? "User blocked successfully"
                    : "User unblocked successfully"
            );

            setBlockModalOpen(false);
        } else {
            toast.error(
                result.payload ||
                "Failed to update user block status"
            );
        }
    };
    /*
     * ==========================================
     * FORMATTERS
     * ==========================================
     */

    const formatValue = (
        value: string | number | null | undefined
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

    const formatDate = (date?: string) => {
        if (!date) return "N/A";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "N/A";
        }

        return parsedDate.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
    };

    const formatTime = (date?: string) => {
        if (!date) return "";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "";
        }

        return parsedDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const capitalize = (value?: string | null) => {
        if (!value) return "N/A";

        return (
            value.charAt(0).toUpperCase() +
            value.slice(1)
        );
    };

    /*
     * ==========================================
     * INLINE SKELETON
     * ==========================================
     */

    if (detailsLoading) {
        return (
            <div className="min-h-full px-5 py-5 md:px-6 lg:px-7 animate-pulse">

                {/* Back */}

                <div className="mb-6 h-5 w-32 rounded bg-gray-200" />

                {/* Header */}

                <div className="mb-6 overflow-hidden rounded-[16px] border border-[#EAECF0] bg-white">

                    <div className="h-24 bg-gray-100" />

                    <div className="px-6 pb-6">

                        <div className="-mt-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

                            <div className="flex items-end gap-5">

                                <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-200" />

                                <div className="pb-1">

                                    <div className="h-6 w-48 rounded bg-gray-200" />

                                    <div className="mt-3 h-4 w-32 rounded bg-gray-100" />

                                    <div className="mt-3 flex gap-2">

                                        <div className="h-7 w-20 rounded-full bg-gray-200" />
                                        <div className="h-7 w-20 rounded-full bg-gray-200" />
                                        <div className="h-7 w-20 rounded-full bg-gray-200" />

                                    </div>

                                </div>

                            </div>

                            <div className="h-10 w-28 rounded-lg bg-gray-200" />

                        </div>

                    </div>

                </div>

                {/* Quick Stats */}

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-24 rounded-[12px] border border-[#EAECF0] bg-white"
                        />
                    ))}

                </div>

                {/* Sections */}

                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="mb-6 rounded-[14px] border border-[#EAECF0] bg-white p-6"
                    >
                        <div className="mb-7 h-5 w-44 rounded bg-gray-200" />

                        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">

                            {[1, 2, 3, 4, 5, 6].map(
                                (field) => (
                                    <div key={field}>
                                        <div className="mb-2 h-3 w-24 rounded bg-gray-100" />
                                        <div className="h-4 w-40 rounded bg-gray-200" />
                                    </div>
                                )
                            )}

                        </div>
                    </div>
                ))}

            </div>
        );
    }

    /*
     * ==========================================
     * ERROR
     * ==========================================
     */

    if (detailsError || !selectedUser) {
        return (
            <div className="px-5 py-5 md:px-6 lg:px-7">

                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-6 flex cursor-pointer items-center gap-2 text-[14px] font-medium text-[#475467] transition-colors hover:text-[#101828]"
                >
                    <ArrowLeft size={17} />
                    Back to All Users
                </button>

                <div className="flex min-h-[450px] items-center justify-center rounded-[16px] border border-[#EAECF0] bg-white">

                    <div className="text-center">

                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                            <UserX
                                size={26}
                                className="text-red-500"
                            />
                        </div>

                        <h2 className="text-[18px] font-semibold text-[#101828]">
                            Unable to load user
                        </h2>

                        <p className="mt-2 text-[14px] text-[#667085]">
                            {detailsError ||
                                "User details could not be found."}
                        </p>

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="mt-5 rounded-[8px] bg-[#2563EB] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-blue-700"
                        >
                            Back to All Users
                        </button>

                    </div>

                </div>

            </div>
        );
    }

    const user = selectedUser;

    /*
     * ==========================================
     * STATUS
     * ==========================================
     */

    const status = user.blocked_by_admin
        ? "Blocked"
        : user.is_deactivated
            ? "Deactivated"
            : "Active";

    const statusVariant = user.blocked_by_admin
        ? "red"
        : user.is_deactivated
            ? "orange"
            : "green";

    const isActive =
        !user.blocked_by_admin &&
        !user.is_deactivated;

    const initials =
        (
            user.first_name?.[0] ||
            user.full_name?.[0] ||
            "U"
        ).toUpperCase();

    /*
     * ==========================================
     * RETURN
     * ==========================================
     */

    return (
        <div className="min-h-full px-5 py-5 md:px-6 lg:px-7">

            {/* ========================================
                BACK
            ======================================== */}

            <button
                type="button"
                onClick={() => router.back()}
                className="mb-6 flex cursor-pointer items-center gap-2 text-[13px] font-medium text-[#667085] transition-colors hover:text-[#101828]"
            >
                <ArrowLeft size={16} />
                Back to All Users
            </button>


            {/* ========================================
                PAGE TITLE
            ======================================== */}

            <div className="mb-6">

                <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#101828]">
                    User Details
                </h1>

                <p className="mt-1 text-[14px] text-[#667085]">
                    View profile, account activity and security information.
                </p>

            </div>


            {/* ========================================
                PROFILE HERO
            ======================================== */}

            <div className="mb-6 overflow-hidden rounded-[16px] border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03)]">

                {/* Accent */}

                <div className="h-[88px] bg-gradient-to-r from-[#EFF6FF] via-[#F5F8FF] to-[#F8FAFC]" />

                <div className="px-6 pb-6">

                    <div className="-mt-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

                        {/* Profile */}

                        <div className="flex items-end gap-5">

                            {/* Avatar */}

                            {!imageError && user.profile_pic ? (

                                <img
                                    src={user.profile_pic}
                                    alt={user.full_name || "User"}
                                    onError={() => setImageError(true)}
                                    className="h-24 w-24 shrink-0 rounded-full border-4 border-white bg-white object-cover shadow-sm"
                                />

                            ) : (

                                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#2563EB] text-[28px] font-semibold text-white shadow-sm">
                                    {initials}
                                </div>

                            )}

                            <div className="pb-1">

                                <div className="flex flex-wrap items-center gap-2">

                                    <h2 className="text-[23px] font-semibold tracking-[-0.02em] text-[#101828]">
                                        {formatValue(user.full_name)}
                                    </h2>

                                    {user.profile_verification_status && (
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50">
                                            <BadgeCheck
                                                size={15}
                                                className="text-[#2563EB]"
                                            />
                                        </span>
                                    )}

                                </div>

                                <p className="mt-1 text-[13px] text-[#667085]">
                                    {user.user_name
                                        ? `@${user.user_name.replace(/^@/, "")}`
                                        : "N/A"}
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-2">

                                    <Tags
                                        text={status}
                                        variant={statusVariant}
                                    />

                                    <Tags
                                        text={capitalize(user.login_type)}
                                        variant="blue"
                                    />

                                    <Tags
                                        text={capitalize(user.role)}
                                        variant="purple"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* User ID + Block Button */}

                        {/* User ID + STATUS ACTIONS */}

                        <div className="flex flex-wrap items-center gap-3">

                            {/* USER ID */}

                            <div className="rounded-[10px] border border-[#EAECF0] bg-[#F9FAFB] px-4 py-2.5">

                                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#98A2B3]">
                                    User ID
                                </p>

                                <p className="mt-0.5 text-[14px] font-semibold text-[#101828]">
                                    #{user.user_id}
                                </p>

                            </div>


                            {/* UNBLOCKED USER */}

                            {!user.blocked_by_admin && (
                                <>
                                    {/* ACTIVATE / DEACTIVATE */}

                                    {user.is_deactivated ? (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleStatusAction("activate")
                                            }
                                            disabled={
                                                statusLoading ||
                                                blockLoading
                                            }
                                            className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[9px] border border-emerald-200 bg-emerald-50 px-4 text-[13px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                                        >

                                            {statusLoading &&
                                                statusLoadingUserId === user.user_id ? (
                                                <>
                                                    <Loader2
                                                        size={16}
                                                        className="animate-spin"
                                                    />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <UserCheck size={16} />
                                                    Activate User
                                                </>
                                            )}

                                        </button>

                                    ) : (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleStatusAction("deactivate")
                                            }
                                            disabled={
                                                statusLoading ||
                                                blockLoading
                                            }
                                            className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[9px] border border-orange-200 bg-orange-50 px-4 text-[13px] font-semibold text-orange-700 transition-colors hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                                        >

                                            {statusLoading &&
                                                statusLoadingUserId === user.user_id ? (
                                                <>
                                                    <Loader2
                                                        size={16}
                                                        className="animate-spin"
                                                    />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <UserX size={16} />
                                                    Deactivate User
                                                </>
                                            )}

                                        </button>

                                    )}


                                    {/* BLOCK USER */}

                                    <button
                                        type="button"
                                        onClick={handleBlockToggle}
                                        disabled={
                                            blockLoading ||
                                            statusLoading
                                        }
                                        className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[9px] border border-red-200 bg-red-50 px-4 text-[13px] font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    >

                                        {blockLoading &&
                                            blockLoadingUserId === user.user_id ? (
                                            <>
                                                <Loader2
                                                    size={16}
                                                    className="animate-spin"
                                                />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <ShieldAlert size={16} />
                                                Block User
                                            </>
                                        )}

                                    </button>

                                </>
                            )}


                            {/* BLOCKED USER */}

                            {user.blocked_by_admin && (

                                <button
                                    type="button"
                                    onClick={handleBlockToggle}
                                    disabled={
                                        blockLoading ||
                                        statusLoading
                                    }
                                    className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[9px] border border-emerald-200 bg-emerald-50 px-4 text-[13px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {blockLoading &&
                                        blockLoadingUserId === user.user_id ? (
                                        <>
                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                            />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck size={16} />
                                            Unblock User
                                        </>
                                    )}

                                </button>

                            )}

                        </div>

                    </div>

                </div>

            </div>


            {/* ========================================
                QUICK STATS
            ======================================== */}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <QuickStat
                    icon={<Coins size={18} />}
                    label="Available Coins"
                    value={formatValue(user.available_coins)}
                    iconClass="bg-amber-50 text-amber-600"
                />

                <QuickStat
                    icon={<Globe size={18} />}
                    label="Connected Socials"
                    value={formatValue(user.total_socials)}
                    iconClass="bg-blue-50 text-blue-600"
                />

                <QuickStat
                    icon={<Activity size={18} />}
                    label="Account Status"
                    value={status}
                    iconClass={
                        isActive
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-orange-50 text-orange-600"
                    }
                />

                <QuickStat
                    icon={<ShieldCheck size={18} />}
                    label="Profile Verification"
                    value={
                        user.profile_verification_status
                            ? "Verified"
                            : "Not Verified"
                    }
                    iconClass={
                        user.profile_verification_status
                            ? "bg-blue-50 text-blue-600"
                            : "bg-gray-100 text-gray-500"
                    }
                />

            </div>


            {/* ========================================
                PERSONAL INFORMATION
            ======================================== */}

            <InfoSection
                title="Personal Information"
                icon={<User size={18} />}
            >

                <div className="grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-2 lg:grid-cols-3">

                    <InfoItem
                        label="Full Name"
                        value={formatValue(user.full_name)}
                    />

                    <InfoItem
                        label="First Name"
                        value={formatValue(user.first_name)}
                    />

                    <InfoItem
                        label="Last Name"
                        value={formatValue(user.last_name)}
                    />

                    <InfoItem
                        label="Email"
                        value={formatValue(user.email)}
                        icon={<Mail size={15} />}
                    />

                    <InfoItem
                        label="Mobile Number"
                        value={
                            user.mobile_num
                                ? `${user.country_code || ""} ${user.mobile_num}`
                                : "N/A"
                        }
                        icon={<Phone size={15} />}
                    />

                    <InfoItem
                        label="Gender"
                        value={capitalize(user.gender)}
                    />

                    <InfoItem
                        label="Date of Birth"
                        value={formatValue(user.dob)}
                        icon={<CalendarDays size={15} />}
                    />

                </div>

            </InfoSection>


            {/* ========================================
                LOCATION
            ======================================== */}

            <InfoSection
                title="Location"
                icon={<MapPin size={18} />}
            >

                <div className="grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-3">

                    <InfoItem
                        label="Country"
                        value={formatValue(user.country)}
                    />

                    <InfoItem
                        label="State"
                        value={formatValue(user.state)}
                    />

                    <InfoItem
                        label="City"
                        value={formatValue(user.city)}
                    />

                </div>

            </InfoSection>


            {/* ========================================
                ACCOUNT & SECURITY
            ======================================== */}

            <InfoSection
                title="Account & Security"
                icon={<ShieldCheck size={18} />}
            >

                <div className="grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-2 lg:grid-cols-4">

                    <InfoItem
                        label="Login Type"
                        value={capitalize(user.login_type)}
                    />

                    <InfoItem
                        label="Role"
                        value={capitalize(user.role)}
                    />

                    <StatusItem
                        label="Private Account"
                        value={Boolean(user.is_private)}
                    />

                    <StatusItem
                        label="Admin Blocked"
                        value={Boolean(user.blocked_by_admin)}
                    />
                    <InfoItem
                        label="Block Reason"
                        value={formatValue(user.admin_block_reason)}
                    />
                    <StatusItem
                        label="Profile Verification"
                        value={Boolean(
                            user.profile_verification_status
                        )}
                    />

                    <StatusItem
                        label="Login Verification"
                        value={Boolean(
                            user.login_verification_status
                        )}
                    />
                    <InfoItem
                        label="Deactivation Reason"
                        value={formatValue(
                            user.admin_deactivation_reason
                        )}
                    />
                </div>

            </InfoSection>


            {/* ========================================
                ABOUT
            ======================================== */}

            <InfoSection
                title="About"
                icon={<UserCheck size={18} />}
            >

                <div className="rounded-[10px] border border-[#EAECF0] bg-[#F9FAFB] px-4 py-4">

                    <p className="text-[14px] leading-6 text-[#475467]">
                        {user.bio || "No bio has been added by this user."}
                    </p>

                </div>

            </InfoSection>


            {/* ========================================
                ACCOUNT ACTIVITY
            ======================================== */}

            <InfoSection
                title="Account Activity"
                icon={<Clock3 size={18} />}
                className="mb-2"
            >

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <ActivityCard
                        icon={<CalendarDays size={18} />}
                        label="Account Created"
                        date={formatDate(user.createdAt)}
                        time={formatTime(user.createdAt)}
                        iconClass="bg-blue-50 text-blue-600"
                    />

                    <ActivityCard
                        icon={<Activity size={18} />}
                        label="Last Updated"
                        date={formatDate(user.updatedAt)}
                        time={formatTime(user.updatedAt)}
                        iconClass="bg-emerald-50 text-emerald-600"
                    />

                </div>

            </InfoSection>
            {statusModalOpen &&
                statusAction &&
                selectedUser && (
                    <ActivationModal
                        isOpen={true}
                        title={
                            statusAction === "deactivate"
                                ? "Deactivate User?"
                                : "Activate User?"
                        }
                        description={
                            statusAction === "deactivate"
                                ? "Please provide a reason for deactivating this user."
                                : "Please provide a reason for activating this user."
                        }
                        actionLabel={
                            statusAction === "deactivate"
                                ? "Deactivate User"
                                : "Activate User"
                        }
                        placeholder={
                            statusAction === "deactivate"
                                ? "Enter reason for deactivation..."
                                : "Enter reason for activation..."
                        }
                        loading={
                            statusLoading &&
                            statusLoadingUserId === selectedUser.user_id
                        }
                        onClose={() => {
                            if (!statusLoading) {
                                setStatusModalOpen(false);
                                setStatusAction(null);
                            }
                        }}
                        onConfirm={handleStatusConfirm}
                    />
                )}
            {blockModalOpen && selectedUser && (
                <ActivationModal
                    isOpen={true}
                    title={
                        selectedUser.blocked_by_admin
                            ? "Unblock User?"
                            : "Block User?"
                    }
                    description={
                        selectedUser.blocked_by_admin
                            ? "Please provide a reason for unblocking this user."
                            : "Please provide a reason for blocking this user."
                    }
                    actionLabel={
                        selectedUser.blocked_by_admin
                            ? "Unblock User"
                            : "Block User"
                    }
                    placeholder={
                        selectedUser.blocked_by_admin
                            ? "Enter reason for unblocking..."
                            : "Enter reason for blocking..."
                    }
                    loading={
                        blockLoading &&
                        blockLoadingUserId === selectedUser.user_id
                    }
                    onClose={() => {
                        if (!blockLoading) {
                            setBlockModalOpen(false);
                        }
                    }}
                    onConfirm={handleBlockConfirm}
                />
            )}
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
 * QUICK STAT
 * ==========================================
 */

function QuickStat({
    icon,
    label,
    value,
    iconClass,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    iconClass: string;
}) {
    return (
        <div className="flex items-center gap-4 rounded-[12px] border border-[#EAECF0] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(16,24,40,0.02)]">

            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] ${iconClass}`}
            >
                {icon}
            </div>

            <div className="min-w-0">

                <p className="text-[11px] font-medium text-[#98A2B3]">
                    {label}
                </p>

                <p className="mt-1 truncate text-[15px] font-semibold text-[#101828]">
                    {value}
                </p>

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
 * STATUS ITEM
 * ==========================================
 */

function StatusItem({
    label,
    value,
}: {
    label: string;
    value: boolean;
}) {
    return (
        <div className="min-w-0">

            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-[#98A2B3]">
                {label}
            </p>

            <div className="flex items-center gap-2">

                {value ? (
                    <>
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50">
                            <CircleCheck
                                size={13}
                                className="text-emerald-600"
                            />
                        </span>

                        <span className="text-[14px] font-medium text-emerald-600">
                            Yes
                        </span>
                    </>
                ) : (
                    <>
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100">
                            <CircleX
                                size={13}
                                className="text-gray-400"
                            />
                        </span>

                        <span className="text-[14px] font-medium text-[#667085]">
                            No
                        </span>
                    </>
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