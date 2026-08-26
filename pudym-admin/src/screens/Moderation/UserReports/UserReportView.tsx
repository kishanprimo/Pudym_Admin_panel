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
    AlertTriangle,
    FileWarning,
    User,
    Mail,
    ShieldCheck,
    Clock3,
    Trash2,
} from "lucide-react";

import { toast } from "react-toastify";

import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

import {
    changeUserStatus,
    clearSelectedUserReport,
    fetchUserReportDetails,
    removeUserReport,
} from "@/store/slices/ModerationSlices/userReportsSlice";

import Tags from "@/components/common/Tags";
import DateTime from "@/components/common/DateTime";
import UserDeleteModal from "@/components/common/UserDeleteModal";
import TogglableSwitch from "@/components/common/TogglableSwitch";

import type {
    UserReportUser,
} from "@/types/ModerationTypes/userReports.types";


const UserReportView = () => {

    const router =
        useRouter();

    const searchParams =
        useSearchParams();

    const dispatch =
        useAppDispatch();

    const reportId =
        searchParams.get(
            "report_id"
        );


    const {
        selectedReport,
        detailsLoading,
        detailsError,
        statusLoading,
        statusLoadingUserId,
        deleteReportLoading,
    } = useAppSelector(
        (state) =>
            state.userReports
    );


    const [
        deleteModalOpen,
        setDeleteModalOpen,
    ] = useState(false);


    /*
     * ==========================================
     * FETCH DETAILS
     * ==========================================
     */

    useEffect(() => {

        if (!reportId) {
            return;
        }

        const parsedReportId =
            Number(reportId);

        if (
            Number.isNaN(
                parsedReportId
            )
        ) {
            return;
        }

        dispatch(
            fetchUserReportDetails(
                parsedReportId
            )
        );

        return () => {
            dispatch(
                clearSelectedUserReport()
            );
        };

    }, [
        dispatch,
        reportId,
    ]);


    /*
     * ==========================================
     * LOADING
     * ==========================================
     */

    if (detailsLoading) {
        return (
            <div className="px-5 py-5 md:px-6 lg:px-7">

                <div className="mb-6 h-5 w-40 animate-pulse rounded bg-[#EAECF0]" />

                <div className="mb-6 h-8 w-72 animate-pulse rounded bg-[#EAECF0]" />

                <div className="mb-5 h-[180px] animate-pulse rounded-2xl border border-[#EAECF0] bg-white" />

                <div className="space-y-5">

                    <div className="h-[300px] animate-pulse rounded-2xl border border-[#EAECF0] bg-white" />

                    <div className="h-[300px] animate-pulse rounded-2xl border border-[#EAECF0] bg-white" />

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

                <BackButton
                    onClick={() =>
                        router.push("/moderation/user-reports")
                    }
                />

                <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-[#EAECF0] bg-white">

                    <div className="text-center">

                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">

                            <AlertTriangle
                                size={22}
                                className="text-red-500"
                            />

                        </div>

                        <p className="text-[16px] font-semibold text-[#101828]">
                            Unable to load user report
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
     * NOT FOUND
     * ==========================================
     */

    if (!selectedReport) {
        return (
            <div className="px-5 py-5 md:px-6 lg:px-7">

                <BackButton
                    onClick={() =>
                        router.push("/moderation/user-reports")
                    }
                />

                <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-[#EAECF0] bg-white">

                    <div className="text-center">

                        <FileWarning
                            size={28}
                            className="mx-auto mb-3 text-[#2563EB]"
                        />

                        <p className="text-[16px] font-semibold text-[#101828]">
                            User report not found
                        </p>

                        <p className="mt-1 text-[13px] text-[#667085]">
                            The requested user report could not be found.
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    const report =
        selectedReport;

    const reporter =
        report.reporter;

    const reported =
        report.reported;


    /*
     * ==========================================
     * STATUS
     * ==========================================
     */

    const handleStatusChange =
        async () => {

            if (
                !reported?.user_id
            ) {
                return;
            }

            try {

                await dispatch(
                    changeUserStatus({
                        userId:
                            reported.user_id,
                        isDeactivated:
                            !reported.is_deactivated,
                    })
                ).unwrap();

                toast.success(
                    reported.is_deactivated
                        ? "User activated successfully"
                        : "User deactivated successfully"
                );

            } catch (error) {

                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Failed to update user status"
                );
            }
        };


    /*
     * ==========================================
     * DELETE REPORT
     * ==========================================
     */

    const handleDeleteReport =
        async () => {

            try {

                await dispatch(
                    removeUserReport(
                        report.report_id
                    )
                ).unwrap();

                setDeleteModalOpen(
                    false
                );

                toast.success(
                    "User report deleted successfully"
                );

                router.replace("/moderation/user-reports");
                router.back();

            } catch (error) {

                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Failed to delete user report"
                );
            }
        };


    return (
        <div className="px-5 py-5 md:px-6 lg:px-7">

            <BackButton
                onClick={() =>
                    router.push("/moderation/user-reports")
                }
            />


            {/* HEADER */}

            <div className="mb-6">

                <div className="flex flex-wrap items-center gap-2">

                    <h1 className="text-[26px] font-bold tracking-[-0.02em] text-[#101828]">
                        User Report Details
                    </h1>

                    <Tags
                        text={
                            report
                                .Report_type
                                ?.report_text ||
                            "Report"
                        }
                        variant="blue"
                    />

                </div>

                <p className="mt-1 text-[13.5px] text-[#667085]">
                    Review the reported user, reporter and moderation information.
                </p>

            </div>


            {/* HERO */}

            <div className="mb-6 overflow-hidden rounded-2xl border border-[#EAECF0] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)]">

                <div className="h-[100px] bg-gradient-to-r from-[#DBEAFE] via-[#EDE9FE] to-[#E0E7FF]" />

                <div className="px-6 pb-6">

                    <div className="-mt-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                        <UserHero
                            user={
                                reported
                            }
                        />

                        <div className="flex items-center gap-3 lg:pb-1">

                            <div className="rounded-xl border border-[#EAECF0] bg-white px-4 py-3">

                                <p className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[#98A2B3]">
                                    Report ID
                                </p>

                                <p className="mt-1 text-[20px] font-bold text-[#2563EB]">
                                    #
                                    {
                                        report.report_id
                                    }
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteModalOpen(
                                        true
                                    )
                                }
                                disabled={
                                    deleteReportLoading
                                }
                                className="flex h-[52px] items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-[13px] font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                            >

                                <Trash2
                                    size={17}
                                />

                                Delete Report

                            </button>

                        </div>

                    </div>

                </div>

            </div>


            {/* REPORT INFORMATION */}

            <DetailSection
                title="Report Information"
                description="Information about why this user was reported."
                icon={
                    <FileWarning size={17} />
                }
            >

                <DetailItem
                    label="Report ID"
                    value={
                        report.report_id
                    }
                />

                <DetailItem
                    label="Report Type"
                    value={
                        report
                            .Report_type
                            ?.report_text ||
                        "N/A"
                    }
                />

                <DetailItem
                    label="Report For"
                    value={
                        report
                            .Report_type
                            ?.report_for ||
                        "N/A"
                    }
                />

                <DetailItem
                    label="Reported User ID"
                    value={
                        report.report_to
                    }
                />

                <DetailItem
                    label="Report Text"
                    value={
                        report.report_text ||
                        "N/A"
                    }
                    fullWidth
                />

                <DetailItem
                    label="Reported At"
                    value={
                        <DateTime
                            date={formatDate(
                                report.createdAt
                            )}
                            time={formatTime(
                                report.createdAt
                            )}
                        />
                    }
                    icon={
                        <Clock3 size={15} />
                    }
                />

                <DetailItem
                    label="Updated At"
                    value={
                        <DateTime
                            date={formatDate(
                                report.updatedAt
                            )}
                            time={formatTime(
                                report.updatedAt
                            )}
                        />
                    }
                    icon={
                        <Clock3 size={15} />
                    }
                />

            </DetailSection>


            {/* REPORTER */}

            <DetailSection
                title="Reported By"
                description="User who submitted this report."
                icon={
                    <User size={17} />
                }
            >

                <UserProfileCard
                    user={
                        reporter
                    }
                />

                <DetailItem
                    label="User ID"
                    value={
                        reporter?.user_id
                    }
                />

                <DetailItem
                    label="Email"
                    value={
                        reporter?.email ||
                        "N/A"
                    }
                    icon={
                        <Mail size={15} />
                    }
                />

                <DetailItem
                    label="Account Role"
                    value={
                        reporter?.role ||
                        "N/A"
                    }
                />

                <DetailItem
                    label="Account Status"
                    value={
                        reporter?.is_deactivated ? (
                            <Tags
                                text="Deactivated"
                                variant="red"
                            />
                        ) : (
                            <Tags
                                text="Active"
                                variant="emerald"
                            />
                        )
                    }
                />

                <DetailItem
                    label="Admin Blocked"
                    value={
                        reporter?.blocked_by_admin ? (
                            <Tags
                                text="Blocked"
                                variant="red"
                            />
                        ) : (
                            <Tags
                                text="Not Blocked"
                                variant="emerald"
                            />
                        )
                    }
                />

            </DetailSection>


            {/* REPORTED USER */}

            <DetailSection
                title="Reported User"
                description="User account that was reported."
                icon={
                    <ShieldCheck size={17} />
                }
            >

                <UserProfileCard
                    user={
                        reported
                    }
                />

                <DetailItem
                    label="User ID"
                    value={
                        reported?.user_id
                    }
                />

                <DetailItem
                    label="Email"
                    value={
                        reported?.email ||
                        "N/A"
                    }
                    icon={
                        <Mail size={15} />
                    }
                />

                <DetailItem
                    label="Account Role"
                    value={
                        reported?.role ||
                        "N/A"
                    }
                />

                <DetailItem
                    label="Account Status"
                    value={
                        <TogglableSwitch
                            isActive={
                                !reported.is_deactivated
                            }
                            onToggle={
                                handleStatusChange
                            }
                            showLabel={true}
                            activeLabel="Active"
                            inactiveLabel="Deactivated"
                            loading={
                                statusLoading &&
                                statusLoadingUserId ===
                                reported.user_id
                            }
                        />
                    }
                />

                <DetailItem
                    label="Admin Blocked"
                    value={
                        reported?.blocked_by_admin ? (
                            <Tags
                                text="Blocked"
                                variant="red"
                            />
                        ) : (
                            <Tags
                                text="Not Blocked"
                                variant="emerald"
                            />
                        )
                    }
                />

                <DetailItem
                    label="Deleted"
                    value={
                        reported?.is_deleted ? (
                            <Tags
                                text="Yes"
                                variant="red"
                            />
                        ) : (
                            <Tags
                                text="No"
                                variant="emerald"
                            />
                        )
                    }
                />

            </DetailSection>


            {/* DELETE MODAL */}

            {deleteModalOpen && (
                <UserDeleteModal
                    onClose={() =>
                        setDeleteModalOpen(
                            false
                        )
                    }
                    onConfirm={
                        handleDeleteReport
                    }
                    title="Delete User Report?"
                    message="Are you sure you want to permanently delete this user report? This action cannot be undone."
                    confirmText="Delete Report"
                    loading={
                        deleteReportLoading
                    }
                />
            )}

        </div>
    );
};


/*
 * ==========================================
 * BACK BUTTON
 * ==========================================
 */

const BackButton = ({
    onClick,
}: {
    onClick: () => void;
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="mb-5 flex items-center gap-1.5 text-[13px] font-medium text-[#667085] transition-colors hover:text-[#101828]"
        >
            <ArrowLeft size={15} />
            Back to User Reports
        </button>
    );
};


/*
 * ==========================================
 * USER HERO
 * ==========================================
 */

const UserHero = ({
    user,
}: {
    user: UserReportUser;
}) => {

    const name =
        user?.full_name ||
        `${user?.first_name || ""} ${user?.last_name || ""
            }`.trim() ||
        "Unknown User";

    const initials =
        name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(
                (part) =>
                    part[0]
            )
            .join("")
            .toUpperCase() ||
        "US";


    return (
        <div className="flex items-end gap-4">

            {user?.profile_pic ? (
                <img
                    src={
                        user.profile_pic
                    }
                    alt={name}
                    className="h-[92px] w-[92px] rounded-2xl border-4 border-white object-cover shadow-[0_4px_12px_rgba(16,24,40,0.15)]"
                />
            ) : (
                <div className="flex h-[92px] w-[92px] items-center justify-center rounded-2xl border-4 border-white bg-[#EFF6FF] text-[24px] font-bold text-[#2563EB] shadow-[0_4px_12px_rgba(16,24,40,0.15)]">
                    {initials}
                </div>
            )}

            <div className="pb-1">

                <h2 className="text-[20px] font-bold tracking-[-0.015em] text-[#101828]">
                    {name}
                </h2>

                <p className="mt-1 text-[13px] font-medium text-[#667085]">
                    {user?.user_name
                        ? `@${user.user_name.replace(
                            /^@/,
                            ""
                        )}`
                        : "N/A"}
                </p>

                <p className="mt-1 text-[12px] text-[#98A2B3]">
                    User ID:{" "}
                    {user?.user_id ??
                        "N/A"}
                </p>

            </div>

        </div>
    );
};


/*
 * ==========================================
 * USER PROFILE CARD
 * ==========================================
 */

const UserProfileCard = ({
    user,
}: {
    user: UserReportUser;
}) => {

    const name =
        user?.full_name ||
        `${user?.first_name || ""} ${user?.last_name || ""
            }`.trim() ||
        "Unknown User";

    const initials =
        name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(
                (part) =>
                    part[0]
            )
            .join("")
            .toUpperCase() ||
        "US";


    return (
        <div className="px-6 py-5 md:col-span-2">

            <div className="flex items-center gap-4 rounded-xl border border-[#EAECF0] bg-[#FAFAFA] p-4">

                {user?.profile_pic ? (
                    <img
                        src={
                            user.profile_pic
                        }
                        alt={name}
                        className="h-16 w-16 shrink-0 rounded-full border border-white object-cover shadow-sm"
                    />
                ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-[17px] font-bold text-white">
                        {initials}
                    </div>
                )}

                <div className="min-w-0">

                    <h3 className="truncate text-[16px] font-bold text-[#101828]">
                        {name}
                    </h3>

                    <p className="mt-0.5 text-[13px] font-medium text-[#667085]">
                        {user?.user_name
                            ? `@${user.user_name.replace(
                                /^@/,
                                ""
                            )}`
                            : "N/A"}
                    </p>

                    <p className="mt-1 text-[12px] text-[#98A2B3]">
                        User ID:{" "}
                        {user?.user_id ??
                            "N/A"}
                    </p>

                </div>

            </div>

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
            className={`px-6 py-4 ${fullWidth
                ? "border-t border-[#F2F4F7] md:col-span-2"
                : ""
                }`}
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
 * DATE FORMAT
 * ==========================================
 */

const formatDate = (
    date?: string
) => {

    if (!date) {
        return "N/A";
    }

    const parsed =
        new Date(date);

    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {
        return "N/A";
    }

    return parsed.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
};


const formatTime = (
    date?: string
) => {

    if (!date) {
        return "";
    }

    const parsed =
        new Date(date);

    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {
        return "";
    }

    return parsed.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit",
        }
    );
};


export default UserReportView;