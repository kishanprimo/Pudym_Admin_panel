"use client";

import {
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { toast } from "react-toastify";
import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import {
    ArrowLeft,
    FileWarning,
    User,
    Mail,
    MapPin,
    Calendar,
    ShieldCheck,
    Eye,
    EyeOff,
    BarChart3,
    Bookmark,
    Share2,
    Globe2,
    Hash,
    FileText,
    Clock3,
    AlertTriangle,
    Image as ImageIcon,
    Trash2,
} from "lucide-react";

import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

import {
    fetchContentReportDetails,
    clearSelectedContentReport,
    removeReportedContent,
    fetchContentReportStats,
} from "@/store/slices/ModerationSlices/contentReportsSlice";
import UserDeleteModal from "@/components/common/UserDeleteModal";
import Tags from "@/components/common/Tags";
import DateTime from "@/components/common/DateTime";


const ContentReportView = () => {

    const router = useRouter();

    const searchParams =
        useSearchParams();

    const dispatch =
        useAppDispatch();

    const reportId =
        searchParams.get("report_id");


    const {
        selectedReport,
        detailsLoading,
        detailsError,
        removeContentLoading,
    } = useAppSelector(
        (state) =>
            state.contentReports
    );


    const [
        imageError,
        setImageError,
    ] = useState(false);
    const [
        removeContentModalOpen,
        setRemoveContentModalOpen,
    ] = useState(false);
    const [
        selectedMedia,
        setSelectedMedia,
    ] = useState<any | null>(null);
    /*
     * ==========================================
     * FETCH REPORT DETAILS
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

        setImageError(false);

        dispatch(
            fetchContentReportDetails(
                parsedReportId
            )
        );

        return () => {

            dispatch(
                clearSelectedContentReport()
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

                <div className="mb-6 h-[190px] animate-pulse rounded-2xl border border-[#EAECF0] bg-white" />

                <div className="space-y-5">

                    <div className="h-[280px] animate-pulse rounded-2xl border border-[#EAECF0] bg-white" />

                    <div className="h-[240px] animate-pulse rounded-2xl border border-[#EAECF0] bg-white" />

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
                    onClick={() =>
                        router.back()
                    }
                    className="mb-6 flex items-center gap-2 text-[14px] font-medium text-[#475467] transition hover:text-[#101828]"
                >
                    <ArrowLeft
                        size={17}
                    />

                    Back to Content Reports
                </button>


                <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-[#EAECF0] bg-white">

                    <div className="text-center">

                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">

                            <AlertTriangle
                                size={22}
                                className="text-red-500"
                            />

                        </div>

                        <p className="text-[16px] font-semibold text-[#101828]">
                            Unable to load content report
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
     * REPORT NOT FOUND
     * ==========================================
     */

    if (!selectedReport) {

        return (
            <div className="px-5 py-5 md:px-6 lg:px-7">

                <button
                    type="button"
                    onClick={() =>
                        router.back()
                    }
                    className="mb-6 flex items-center gap-2 text-[14px] font-medium text-[#475467] transition hover:text-[#101828]"
                >
                    <ArrowLeft
                        size={17}
                    />

                    Back to Content Reports
                </button>


                <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-[#EAECF0] bg-white">

                    <div className="text-center">

                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF]">

                            <FileWarning
                                size={22}
                                className="text-[#2563EB]"
                            />

                        </div>

                        <p className="text-[16px] font-semibold text-[#101828]">
                            Content report not found
                        </p>

                        <p className="mt-1 text-[13px] text-[#667085]">
                            The requested content report could not be found.
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    const report =
        selectedReport;

    const social =
        report.Social;

    const reporter =
        report.User;

    const owner =
        social?.User;

    const reportType =
        report.Report_type;
    const contentType =
        String(
            social?.social_type || ""
        ).toLowerCase();

    const isReel =
        contentType.includes("reel");

    const isPost =
        !isReel;
    const contentMedia =
        social?.Media?.[0]?.media_location || "";
    const handleRemoveContent = async () => {
        if (!social?.social_id) {
            return;
        }

        try {
            await dispatch(
                removeReportedContent(
                    social.social_id
                )
            ).unwrap();

            /*
             * Refresh the report details from the backend.
             *
             * This makes sure the detail page is showing
             * the persisted removed_by_admin value rather
             * than only relying on the optimistic Redux update.
             */
            if (reportId) {
                await dispatch(
                    fetchContentReportDetails(
                        Number(reportId)
                    )
                ).unwrap();
            }

            await dispatch(
                fetchContentReportStats()
            ).unwrap();

            setRemoveContentModalOpen(false);

            toast.success(
                "Content removed successfully"
            );

        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to remove content"
            );
        }
    };
    /*
     * ==========================================
     * HELPERS
     * ==========================================
     */

    const displayValue = (
        value:
            string |
            number |
            null |
            undefined
    ) => {

        if (
            value === null ||
            value === undefined ||
            !String(value).trim()
        ) {
            return "N/A";
        }

        return String(value);
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


    const getUserName = (
        user:
            typeof reporter
    ) => {

        return (
            user?.full_name ||
            `${user?.first_name || ""} ${user?.last_name || ""
                }`.trim() ||
            "Unknown User"
        );
    };


    const getAvatarText = (
        user:
            typeof reporter
    ) => {

        const name =
            getUserName(user);

        const words =
            name
                .trim()
                .split(/\s+/)
                .filter(Boolean);

        if (
            words.length >= 2
        ) {

            return (
                `${words[0][0]}${words[1][0]}`
            ).toUpperCase();
        }

        return (
            words[0]
                ?.slice(0, 2)
                .toUpperCase() ||
            "US"
        );
    };


    const getUsername = (
        user:
            typeof reporter
    ) => {

        if (!user?.user_name) {
            return "N/A";
        }

        return `@${user.user_name.replace(
            /^@/,
            ""
        )}`;
    };


    const isRemoved =
        social?.removed_by_admin === true;

    const isActive =
        social?.status === true &&
        !isRemoved;

    const location = [
        social?.location,
        social?.country,
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
                onClick={() =>
                    router.back()
                }
                className="mb-5 flex items-center gap-1.5 text-[13px] font-medium text-[#667085] transition-colors hover:text-[#101828]"
            >
                <ArrowLeft
                    size={15}
                />

                Back to Content Reports
            </button>


            {/* ========================================
                PAGE HEADER
            ======================================== */}

            <div className="mb-6">

                <div className="flex flex-wrap items-center gap-2">

                    <h1 className="text-[26px] font-bold tracking-[-0.02em] text-[#101828]">
                        Content Report Details
                    </h1>

                    <Tags
                        text={
                            isRemoved
                                ? "Removed by Admin"
                                : isActive
                                    ? "Active"
                                    : "Hidden"
                        }
                        variant={
                            isRemoved
                                ? "red"
                                : isActive
                                    ? "emerald"
                                    : "orange"
                        }
                    />

                </div>
                {isRemoved && (
                    <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
                        <AlertTriangle
                            size={18}
                            className="mt-0.5 shrink-0 text-red-600"
                        />

                        <div>
                            <p className="text-[13px] font-semibold text-red-800">
                                Content removed by administrator
                            </p>

                            <p className="mt-0.5 text-[12px] text-red-700">
                                This content has been removed from the platform.
                                The content report has been retained for moderation history.
                            </p>
                        </div>
                    </div>
                )}
                <p className="mt-1 text-[13.5px] text-[#667085]">
                    Review reported content, report information and associated users.
                </p>

            </div>


            {/* ========================================
                REPORT HERO
            ======================================== */}

            <div className="mb-6 overflow-hidden rounded-2xl border border-[#EAECF0] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)]">

                {/* TOP BANNER */}

                <div className="h-[100px] bg-gradient-to-r from-[#DBEAFE] via-[#EDE9FE] to-[#E0E7FF]" />

                <div className="px-6 pb-6">

                    <div className="-mt-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                        {/* CONTENT */}

                        <div className="relative shrink-0">

                            {contentMedia && !imageError ? (

                                isReel ? (
                                    <video
                                        src={contentMedia}
                                        muted
                                        playsInline
                                        autoPlay
                                        loop
                                        className="h-[92px] w-[92px] rounded-2xl border-4 border-white object-cover shadow-[0_4px_12px_rgba(16,24,40,0.15)]"
                                    />
                                ) : (
                                    <img
                                        src={contentMedia}
                                        alt="Reported content"
                                        className="h-[92px] w-[92px] rounded-2xl border-4 border-white object-cover shadow-[0_4px_12px_rgba(16,24,40,0.15)]"
                                        onError={() =>
                                            setImageError(true)
                                        }
                                    />
                                )

                            ) : (

                                <div className="flex h-[92px] w-[92px] items-center justify-center rounded-2xl border-4 border-white bg-[#EFF6FF] text-[#2563EB] shadow-[0_4px_12px_rgba(16,24,40,0.15)]">

                                    <FileWarning
                                        size={30}
                                    />

                                </div>

                            )}

                        </div>


                        {/* SUMMARY CARDS */}

                        <div className="flex flex-wrap items-end gap-3 lg:pb-1">

                            <SummaryCard
                                icon={
                                    <Eye
                                        size={16}
                                    />
                                }
                                label="Views"
                                value={
                                    social?.total_views ??
                                    0
                                }
                                accent="blue"
                            />

                            <SummaryCard
                                icon={
                                    <Bookmark
                                        size={16}
                                    />
                                }
                                label="Saves"
                                value={
                                    social?.total_saves ??
                                    0
                                }
                                accent="purple"
                            />

                            <SummaryCard
                                icon={
                                    <Share2
                                        size={16}
                                    />
                                }
                                label="Shares"
                                value={
                                    social?.total_shares ??
                                    0
                                }
                                accent="green"
                            />

                            <button
                                type="button"
                                onClick={() => {
                                    if (!isRemoved) {
                                        setRemoveContentModalOpen(true);
                                    }
                                }}
                                disabled={
                                    isRemoved ||
                                    removeContentLoading
                                }
                                className={`flex h-[52px] items-center gap-2 rounded-xl border px-4 text-[13px] font-semibold transition ${isRemoved
                                    ? "cursor-not-allowed border-red-200 bg-red-50 text-red-600"
                                    : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                                    } disabled:opacity-100`}
                            >
                                <Trash2 size={17} />

                                {isRemoved
                                    ? "Content Removed"
                                    : "Remove Content"}
                            </button>
                        </div>

                    </div>

                </div>

            </div>


            {/* ========================================
                REPORT INFORMATION
            ======================================== */}

            <DetailSection
                title="Report Information"
                description="Information about why this content was reported."
                icon={
                    <FileWarning
                        size={17}
                    />
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
                        reportType?.report_text ||
                        "N/A"
                    }
                />

                <DetailItem
                    label="Report For"
                    value={
                        reportType?.report_for ||
                        "N/A"
                    }
                />

                <DetailItem
                    label="Social ID"
                    value={
                        report.social_id
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
                        <Clock3
                            size={15}
                        />
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
                        <Clock3
                            size={15}
                        />
                    }
                />

            </DetailSection>


            {/* ========================================
                REPORTED BY
            ======================================== */}

            <DetailSection
                title="Reported By"
                description="User who submitted this content report."
                icon={
                    <User
                        size={17}
                    />
                }
            >

                <UserProfileCard
                    user={reporter}
                    name={getUserName(
                        reporter
                    )}
                    username={getUsername(
                        reporter
                    )}
                    getAvatarText={
                        getAvatarText(
                            reporter
                        )
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
                        displayValue(
                            reporter?.email
                        )
                    }
                    icon={
                        <Mail
                            size={15}
                        />
                    }
                />

                <DetailItem
                    label="Account Role"
                    value={
                        displayValue(
                            reporter?.role
                        )
                    }
                />

                <DetailItem
                    label="Account Status"
                    value={
                        reporter?.is_deactivated
                            ? (
                                <Tags
                                    text="Deactivated"
                                    variant="red"
                                />
                            )
                            : (
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
                        reporter?.blocked_by_admin
                            ? (
                                <Tags
                                    text="Blocked"
                                    variant="red"
                                />
                            )
                            : (
                                <Tags
                                    text="Not Blocked"
                                    variant="emerald"
                                />
                            )
                    }
                />

            </DetailSection>


            {/* ========================================
                CONTENT OWNER
            ======================================== */}

            <DetailSection
                title="Content Owner"
                description="User who owns the reported content."
                icon={
                    <ShieldCheck
                        size={17}
                    />
                }
            >

                <UserProfileCard
                    user={owner}
                    name={getUserName(
                        owner
                    )}
                    username={getUsername(
                        owner
                    )}
                    getAvatarText={
                        getAvatarText(
                            owner
                        )
                    }
                />

                <DetailItem
                    label="User ID"
                    value={
                        owner?.user_id
                    }
                />

                <DetailItem
                    label="Email"
                    value={
                        displayValue(
                            owner?.email
                        )
                    }
                    icon={
                        <Mail
                            size={15}
                        />
                    }
                />

                <DetailItem
                    label="Account Status"
                    value={
                        owner?.is_deactivated
                            ? (
                                <Tags
                                    text="Deactivated"
                                    variant="red"
                                />
                            )
                            : (
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
                        owner?.blocked_by_admin
                            ? (
                                <Tags
                                    text="Blocked"
                                    variant="red"
                                />
                            )
                            : (
                                <Tags
                                    text="Not Blocked"
                                    variant="emerald"
                                />
                            )
                    }
                />

            </DetailSection>


            {/* ========================================
                CONTENT DETAILS
            ======================================== */}

            <DetailSection
                title="Content Details"
                description="Metadata and statistics for the reported content."
                icon={
                    <FileText
                        size={17}
                    />
                }
            >

                <DetailItem
                    label="Content ID"
                    value={
                        social?.social_id
                    }
                />

                <DetailItem
                    label="Content Type"
                    value={
                        <Tags
                            text={isReel ? "Reel" : "Post"}
                            variant={
                                isReel
                                    ? "purple"
                                    : "emerald"
                            }
                        />
                    }
                />

                <DetailItem
                    label="Audience"
                    value={
                        displayValue(
                            social?.audience_type
                        )
                    }
                />

                <DetailItem
                    label="Aspect Ratio"
                    value={
                        displayValue(
                            social?.aspect_ratio
                        )
                    }
                />

                {isReel && (
                    <DetailItem
                        label="Video Height"
                        value={
                            social?.video_hight
                                ? `${social.video_hight}px`
                                : "N/A"
                        }
                    />
                )}

                <DetailItem
                    label="Location"
                    value={
                        displayValue(
                            social?.location
                        )
                    }
                    icon={
                        <MapPin
                            size={15}
                        />
                    }
                />

                <DetailItem
                    label="Country"
                    value={
                        displayValue(
                            social?.country
                        )
                    }
                    icon={
                        <Globe2
                            size={15}
                        />
                    }
                />

                <DetailItem
                    label="Views"
                    value={
                        Number(
                            social?.total_views ??
                            0
                        ).toLocaleString(
                            "en-IN"
                        )
                    }
                    icon={
                        <Eye
                            size={15}
                        />
                    }
                />

                <DetailItem
                    label="Saves"
                    value={
                        Number(
                            social?.total_saves ??
                            0
                        ).toLocaleString(
                            "en-IN"
                        )
                    }
                    icon={
                        <Bookmark
                            size={15}
                        />
                    }
                />

                <DetailItem
                    label="Shares"
                    value={
                        Number(
                            social?.total_shares ??
                            0
                        ).toLocaleString(
                            "en-IN"
                        )
                    }
                    icon={
                        <Share2
                            size={15}
                        />
                    }
                />

                <DetailItem
                    label="Content Status"
                    value={
                        isRemoved ? (
                            <Tags
                                text="Removed by Admin"
                                variant="red"
                            />
                        ) : isActive ? (
                            <Tags
                                text="Active"
                                variant="emerald"
                            />
                        ) : (
                            <Tags
                                text="Hidden"
                                variant="orange"
                            />
                        )
                    }
                />
                <DetailItem
                    label="Removed By Admin"
                    value={
                        isRemoved ? (
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
                <DetailItem
                    label="Deleted By User"
                    value={
                        social?.deleted_by_user
                            ? (
                                <Tags
                                    text="Yes"
                                    variant="red"
                                />
                            )
                            : (
                                <Tags
                                    text="No"
                                    variant="emerald"
                                />
                            )
                    }
                />

                <DetailItem
                    label="Content Created At"
                    value={
                        <DateTime
                            date={formatDate(
                                social?.createdAt
                            )}
                            time={formatTime(
                                social?.createdAt
                            )}
                        />
                    }
                    icon={
                        <Calendar
                            size={15}
                        />
                    }
                />

                <DetailItem
                    label="Content Updated At"
                    value={
                        <DateTime
                            date={formatDate(
                                social?.updatedAt
                            )}
                            time={formatTime(
                                social?.updatedAt
                            )}
                        />
                    }
                    icon={
                        <Clock3
                            size={15}
                        />
                    }
                />

            </DetailSection>


            {/* ========================================
                HASHTAGS
            ======================================== */}

            <DetailSection
                title="Hashtags"
                description="Hashtags associated with the reported content."
                icon={
                    <Hash
                        size={17}
                    />
                }
            >

                <div className="px-6 py-5 md:col-span-2">

                    {social?.hashtag &&
                        social.hashtag.length > 0 ? (

                        <div className="flex flex-wrap gap-2">

                            {social.hashtag.map(
                                (
                                    hashtag,
                                    index
                                ) => (
                                    <span
                                        key={`${hashtag}-${index}`}
                                        className="rounded-full bg-[#EFF6FF] px-3 py-1.5 text-[12px] font-medium text-[#2563EB]"
                                    >
                                        #{hashtag}
                                    </span>
                                )
                            )}

                        </div>

                    ) : (

                        <p className="text-[13px] text-[#667085]">
                            No hashtags available.
                        </p>

                    )}

                </div>

            </DetailSection>


            {/* ========================================
                MEDIA
            ======================================== */}

            {/* ========================================
    MEDIA
======================================== */}

            <DetailSection
                title="Media"
                description={
                    isReel
                        ? "Video and media attached to the reported reel."
                        : "Images and media attached to the reported post."
                }
                icon={
                    <ImageIcon
                        size={17}
                    />
                }
            >

                {social?.Media &&
                    social.Media.length > 0 ? (

                    <div className="grid grid-cols-1 gap-4 px-6 py-5 md:col-span-2 md:grid-cols-2 lg:grid-cols-3">

                        {social.Media.map(
                            (
                                media,
                                index
                            ) => (

                                <button
                                    type="button"
                                    key={
                                        media.media_id ??
                                        index
                                    }
                                    onClick={() =>
                                        setSelectedMedia(
                                            media
                                        )
                                    }
                                    className="group overflow-hidden rounded-xl border border-[#EAECF0] bg-[#FAFAFA] text-left transition hover:border-[#BFC7D4] hover:shadow-[0_4px_12px_rgba(16,24,40,0.08)] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
                                >

                                    <div className="relative flex h-[220px] items-center justify-center overflow-hidden bg-[#F2F4F7]">

                                        {media.media_location ? (

                                            isReel ? (
                                                <video
                                                    src={
                                                        media.media_location
                                                    }
                                                    muted
                                                    playsInline
                                                    preload="metadata"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <img
                                                    src={
                                                        media.media_location
                                                    }
                                                    alt="Content media"
                                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                                                />
                                            )

                                        ) : (

                                            <ImageIcon
                                                size={28}
                                                className="text-[#98A2B3]"
                                            />

                                        )}

                                        {/* Hover overlay */}

                                        {media.media_location && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">

                                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#344054] opacity-0 shadow-lg transition group-hover:opacity-100">

                                                    {isReel ? (
                                                        <Eye size={19} />
                                                    ) : (
                                                        <ImageIcon size={19} />
                                                    )}

                                                </div>

                                            </div>
                                        )}

                                    </div>

                                    <div className="flex items-center justify-between border-t border-[#EAECF0] px-4 py-3">

                                        <div>
                                            <p className="text-[12px] font-semibold text-[#344054]">
                                                {isReel
                                                    ? `Video ${index + 1}`
                                                    : `Image ${index + 1}`}
                                            </p>

                                            <p className="mt-0.5 text-[11px] text-[#98A2B3]">
                                                Click to preview
                                            </p>
                                        </div>

                                        <Eye
                                            size={15}
                                            className="text-[#98A2B3]"
                                        />

                                    </div>

                                </button>

                            )
                        )}

                    </div>

                ) : (

                    <div className="px-6 py-8 md:col-span-2">

                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#D0D5DD] bg-[#FAFAFA] py-10">

                            <ImageIcon
                                size={28}
                                className="mb-2 text-[#98A2B3]"
                            />

                            <p className="text-[13px] font-medium text-[#667085]">
                                No media available
                            </p>

                        </div>

                    </div>

                )}

            </DetailSection>


            <div className="h-3" />
            {removeContentModalOpen && (
                <UserDeleteModal
                    onClose={() =>
                        setRemoveContentModalOpen(
                            false
                        )
                    }
                    onConfirm={
                        handleRemoveContent
                    }
                    title="Remove Content?"
                    message="Are you sure you want to permanently remove this content? This action cannot be undone."
                    confirmText="Remove Content"
                    loading={
                        removeContentLoading
                    }
                />
            )}
            {/* ========================================
    MEDIA PREVIEW MODAL
======================================== */}

            {selectedMedia?.media_location && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                    onClick={() =>
                        setSelectedMedia(null)
                    }
                >

                    {/* Modal */}

                    <div
                        className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-[#101828] shadow-2xl"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* Header */}

                        <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-[#101828] px-5 py-4">

                            <div>

                                <p className="text-[14px] font-semibold text-white">
                                    {isReel
                                        ? "Reported Reel"
                                        : "Reported Post"}
                                </p>

                                <p className="mt-0.5 text-[11px] text-[#98A2B3]">
                                    Media preview
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedMedia(null)
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#98A2B3] transition hover:bg-white/10 hover:text-white"
                                aria-label="Close media preview"
                            >
                                <span className="text-[24px] leading-none">
                                    ×
                                </span>
                            </button>

                        </div>


                        {/* Media */}

                        <div className="flex min-h-0 flex-1 items-center justify-center bg-black p-4 md:p-8">

                            {isReel ? (

                                <video
                                    src={
                                        selectedMedia.media_location
                                    }
                                    controls
                                    autoPlay
                                    playsInline
                                    className="max-h-[75vh] max-w-full rounded-lg object-contain"
                                />

                            ) : (

                                <img
                                    src={
                                        selectedMedia.media_location
                                    }
                                    alt="Reported content"
                                    className="max-h-[75vh] max-w-full rounded-lg object-contain"
                                />

                            )}

                        </div>


                        {/* Footer */}

                        <div className="flex shrink-0 items-center justify-between border-t border-white/10 bg-[#101828] px-5 py-3">

                            <p className="text-[11px] text-[#98A2B3]">
                                {isReel
                                    ? "Use the video controls to inspect the reel."
                                    : "Click outside the preview or × to close."}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedMedia(null)
                                }
                                className="rounded-lg bg-white px-4 py-2 text-[12px] font-semibold text-[#344054] transition hover:bg-[#F2F4F7]"
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>
            )}
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
    accent:
    | "blue"
    | "purple"
    | "green";
}


const summaryAccentStyles = {

    blue: {
        icon: "bg-[#EFF6FF] text-[#2563EB]",
        value: "text-[#2563EB]",
    },

    purple: {
        icon: "bg-[#F5F3FF] text-[#7C3AED]",
        value: "text-[#7C3AED]",
    },

    green: {
        icon: "bg-[#ECFDF3] text-[#039855]",
        value: "text-[#039855]",
    },

} as const;


const SummaryCard = ({
    icon,
    label,
    value,
    accent,
}: SummaryCardProps) => {

    const styles =
        summaryAccentStyles[
        accent
        ];

    return (
        <div className="min-w-[130px] rounded-xl border border-[#EAECF0] bg-white px-4 py-3.5 shadow-[0_1px_3px_rgba(16,24,40,0.05)]">

            <div className="flex items-center gap-2">

                <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${styles.icon}`}
                >
                    {icon}
                </span>

                <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#98A2B3]">
                    {label}
                </span>

            </div>

            <p
                className={`mt-2 text-[20px] font-bold ${styles.value}`}
            >
                {value}
            </p>

        </div>
    );
};


/*
 * ==========================================
 * USER PROFILE CARD
 * ==========================================
 */

interface UserProfileCardProps {
    user: any;
    name: string;
    username: string;
    getAvatarText: string;
}


const UserProfileCard = ({
    user,
    name,
    username,
    getAvatarText,
}: UserProfileCardProps) => {

    const [
        imageError,
        setImageError,
    ] = useState(false);


    return (
        <div className="px-6 py-5 md:col-span-2">

            <div className="flex items-center gap-4 rounded-xl border border-[#EAECF0] bg-[#FAFAFA] p-4">

                {user?.profile_pic &&
                    !imageError ? (

                    <img
                        src={
                            user.profile_pic
                        }
                        alt={name}
                        className="h-16 w-16 shrink-0 rounded-full border border-white object-cover shadow-sm"
                        onError={() =>
                            setImageError(
                                true
                            )
                        }
                    />

                ) : (

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-[17px] font-bold text-white">
                        {getAvatarText}
                    </div>

                )}


                <div className="min-w-0">

                    <h3 className="truncate text-[16px] font-bold text-[#101828]">
                        {name}
                    </h3>

                    <p className="mt-0.5 text-[13px] font-medium text-[#667085]">
                        {username}
                    </p>

                    <p className="mt-1 text-[12px] text-[#98A2B3]">
                        User ID: {user?.user_id ?? "N/A"}
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
            className={
                `px-6 py-4 ${fullWidth
                    ? "md:col-span-2 border-t border-[#F2F4F7]"
                    : ""
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


export default ContentReportView;