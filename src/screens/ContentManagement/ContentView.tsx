"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ArrowLeft,
    Eye,
    Film,
    Heart,
    Image as ImageIcon,
    MapPin,
    MessageCircle,
    Share2,
    Bookmark,
    CalendarDays,
    Hash,
    Globe,
    Users,
    Clock3,
    Film as ReelIcon,
    FileImage,
    Layers,
    Ruler,
    IdCard,
} from "lucide-react";

import {
    fetchContentDetails,
    clearSelectedContent,
} from "@/store/slices/ContentManagementSlices/contentManagementSlice";

import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

import Tags from "@/components/common/Tags";


const ContentView = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    const socialIdParam = searchParams.get("social_id");
    const socialId = socialIdParam ? Number(socialIdParam) : null;

    const {
        selectedContent,
        detailsLoading,
        detailsError,
    } = useAppSelector((state) => state.contentManagement);

    useEffect(() => {
        if (socialId === null || Number.isNaN(socialId)) return;
        dispatch(fetchContentDetails(socialId));
        return () => { dispatch(clearSelectedContent()); };
    }, [dispatch, socialId]);

    const formatDate = (date?: string) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
        });
    };

    const formatTime = (date?: string) => {
        if (!date) return "";
        return new Date(date).toLocaleTimeString("en-IN", {
            hour: "2-digit", minute: "2-digit",
        });
    };

    const getAvatarText = (user: any) => {
        const name = user?.full_name || user?.user_name || "User";
        const words = name.trim().split(/\s+/).filter(Boolean);
        if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
        return words[0]?.slice(0, 2).toUpperCase() || "US";
    };

    /* ── LOADING ── */
    if (detailsLoading) {
        return (
            <div className="px-5 py-5 md:px-6 lg:px-7">
                <div className="mb-6 h-5 w-36 animate-pulse rounded bg-[#EAECF0]" />
                <div className="mb-6 h-8 w-52 animate-pulse rounded bg-[#EAECF0]" />
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(340px,1fr)]">
                    <div className="h-[640px] animate-pulse rounded-[16px] bg-[#EAECF0]" />
                    <div className="space-y-4">
                        {[160, 220, 200, 180].map((h, i) => (
                            <div key={i} style={{ height: h }} className="animate-pulse rounded-[14px] bg-[#EAECF0]" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    /* ── ERROR ── */
    if (detailsError || !selectedContent) {
        return (
            <div className="px-5 py-5 md:px-6 lg:px-7">
                <button type="button" onClick={() => router.back()}
                    className="mb-6 flex cursor-pointer items-center gap-2 text-[13px] font-medium text-[#667085] transition-colors hover:text-[#101828]">
                    <ArrowLeft size={16} /> Back to Content
                </button>
                <div className="flex min-h-[450px] items-center justify-center rounded-[16px] border border-[#EAECF0] bg-white">
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                            <Film size={26} className="text-red-500" />
                        </div>
                        <h2 className="text-[18px] font-semibold text-[#101828]">Unable to load content</h2>
                        <p className="mt-2 text-[14px] text-[#667085]">{detailsError || "Content details were not found."}</p>
                        <button type="button" onClick={() => router.back()}
                            className="mt-5 rounded-[8px] bg-[#2563EB] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-blue-700">
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const content = selectedContent;
    const creator = content.User;
    const media = content.Media?.[0];
    const isReel = content.social_type === "reel";

    return (
        <div className="min-h-full px-5 py-5 md:px-6 lg:px-7">

            {/* ── BACK ── */}
            <button type="button" onClick={() => router.back()}
                className="mb-6 flex cursor-pointer items-center gap-2 text-[13px] font-medium text-[#667085] transition-colors hover:text-[#101828]">
                <ArrowLeft size={16} />
                Back to {isReel ? "Reels" : "Posts"}
            </button>

            {/* ── PAGE TITLE ── */}
            <div className="mb-6">
                <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#101828]">
                    {isReel ? "Reel Details" : "Post Details"}
                </h1>
                <p className="mt-1 text-[14px] text-[#667085]">
                    View published content details and engagement metrics.
                </p>
            </div>

            {/* ── HERO BANNER ── */}
            <div className="mb-6 overflow-hidden rounded-[16px] border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
                <div className="h-[88px] bg-gradient-to-r from-[#EFF6FF] via-[#F5F8FF] to-[#F8FAFC]" />
                <div className="px-6 pb-6">
                    <div className="-mt-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                        <div className="flex items-end gap-5">
                            {/* Avatar */}
                            {creator?.profile_pic ? (
                                <img src={creator.profile_pic} alt={creator.full_name || "Creator"}
                                    className="h-24 w-24 shrink-0 rounded-full border-4 border-white bg-white object-cover shadow-sm" />
                            ) : (
                                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#2563EB] text-[28px] font-semibold text-white shadow-sm">
                                    {getAvatarText(creator)}
                                </div>
                            )}
                            <div className="pb-1">
                                <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#101828]">
                                    {creator?.full_name || "Unknown Creator"}
                                </h2>
                                <p className="mt-0.5 text-[13px] text-[#667085]">
                                    {creator?.user_name ? `@${creator.user_name.replace(/^@/, "")}` : "N/A"}
                                </p>
                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <Tags
                                        text={content.status ? "Active" : "Inactive"}
                                        variant={content.status ? "emerald" : "red"}
                                    />
                                    <Tags
                                        text={isReel ? "Reel" : "Post"}
                                        variant={isReel ? "purple" : "blue"}
                                    />
                                    {content.removed_by_admin && (
                                        <Tags text="Removed by Admin" variant="red" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content ID badge */}
                        <div className="rounded-[10px] border border-[#EAECF0] bg-[#F9FAFB] px-4 py-2.5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#98A2B3]">Content ID</p>
                            <p className="mt-0.5 text-[14px] font-semibold text-[#101828]">#{content.social_id}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MAIN GRID ── */}
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(340px,1fr)]">

                {/* ── LEFT: MEDIA + DESCRIPTION ── */}
                <div className="space-y-6">

                    {/* Media Card */}
                    <div className="overflow-hidden rounded-[14px] border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.02)]">
                        <div className="flex items-center gap-3 border-b border-[#EAECF0] px-6 py-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#EFF6FF] text-[#2563EB]">
                                {isReel ? <ReelIcon size={17} /> : <FileImage size={17} />}
                            </div>
                            <h2 className="text-[15px] font-semibold text-[#101828]">
                                {isReel ? "Reel Preview" : "Post Preview"}
                            </h2>
                        </div>

                        <div className="flex min-h-[480px] items-center justify-center bg-[#F9FAFB] p-6">
                            {media?.media_location ? (
                                isReel ? (
                                    <video src={media.media_location} controls playsInline
                                        className="max-h-[580px] max-w-full rounded-[12px] object-contain shadow-md" />
                                ) : (
                                    <img src={media.media_location} alt="Post content"
                                        className="max-h-[580px] max-w-full rounded-[12px] object-contain shadow-md" />
                                )
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2F4F7]">
                                        {isReel ? <Film size={30} className="text-[#98A2B3]" /> : <ImageIcon size={30} className="text-[#98A2B3]" />}
                                    </div>
                                    <p className="text-[14px] font-medium text-[#475467]">Media unavailable</p>
                                    <p className="mt-1 text-[12px] text-[#98A2B3]">No media file attached to this content.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description Card */}
                    <div className="overflow-hidden rounded-[14px] border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.02)]">
                        <div className="flex items-center gap-3 border-b border-[#EAECF0] px-6 py-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#EFF6FF] text-[#2563EB]">
                                <MessageCircle size={17} />
                            </div>
                            <h2 className="text-[15px] font-semibold text-[#101828]">Description</h2>
                        </div>
                        <div className="px-6 py-5">
                            <p className="whitespace-pre-wrap break-words text-[14px] leading-7 text-[#344054]">
                                {content.social_desc || <span className="italic text-[#98A2B3]">No description provided.</span>}
                            </p>

                            {content.hashtag && content.hashtag.length > 0 && (
                                <div className="mt-5">
                                    <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#98A2B3]">Hashtags</p>
                                    <div className="flex flex-wrap gap-2">
                                        {content.hashtag.map((tag, i) => (
                                            <span key={`${tag}-${i}`}
                                                className="inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] px-3 py-1 text-[12px] font-medium text-[#2563EB]">
                                                <Hash size={11} />
                                                {String(tag).replace(/^#/, "")}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Comments Card */}
                    <div className="overflow-hidden rounded-[14px] border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.02)]">
                        <div className="flex items-center justify-between border-b border-[#EAECF0] px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#EFF6FF] text-[#2563EB]">
                                    <MessageCircle size={17} />
                                </div>
                                <div>
                                    <h2 className="text-[15px] font-semibold text-[#101828]">Comments</h2>
                                    <p className="text-[12px] text-[#667085]">User comments on this content</p>
                                </div>
                            </div>
                            <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[#EFF6FF] px-2 text-[12px] font-semibold text-[#2563EB]">
                                {content.Comments?.length ?? 0}
                            </span>
                        </div>

                        {content.Comments && content.Comments.length > 0 ? (
                            <div className="divide-y divide-[#EAECF0]">
                                {content.Comments.map((comment) => {
                                    const commenter = comment.commenter;
                                    return (
                                        <div key={comment.comment_id} className="flex gap-3 px-6 py-4 transition-colors hover:bg-[#F9FAFB]">
                                            {commenter?.profile_pic ? (
                                                <img src={commenter.profile_pic} alt={commenter.full_name || "User"}
                                                    className="h-9 w-9 shrink-0 rounded-full border border-[#EAECF0] object-cover" />
                                            ) : (
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F2F4F7] text-[11px] font-semibold text-[#475467]">
                                                    {getAvatarText(commenter)}
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="text-[13px] font-semibold text-[#101828]">
                                                        {commenter?.full_name || "Unknown User"}
                                                    </p>
                                                    {commenter?.user_name && (
                                                        <p className="text-[11px] text-[#667085]">
                                                            @{commenter.user_name.replace(/^@/, "")}
                                                        </p>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-[13px] leading-5 text-[#475467]">
                                                    {comment.comment || "No comment text"}
                                                </p>
                                                {comment.createdAt && (
                                                    <p className="mt-1.5 text-[11px] text-[#98A2B3]">
                                                        {formatDate(comment.createdAt)} · {formatTime(comment.createdAt)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="px-6 py-14 text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F2F4F7]">
                                    <MessageCircle size={22} className="text-[#98A2B3]" />
                                </div>
                                <p className="text-[14px] font-medium text-[#475467]">No comments yet</p>
                                <p className="mt-1 text-[12px] text-[#98A2B3]">This content has no comments.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── RIGHT: DETAILS COLUMN ── */}
                <div className="space-y-6">

                    {/* Engagement Stats */}
                    <div className="overflow-hidden rounded-[14px] border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.02)]">
                        <div className="flex items-center gap-3 border-b border-[#EAECF0] px-6 py-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#EFF6FF] text-[#2563EB]">
                                <Eye size={17} />
                            </div>
                            <h2 className="text-[15px] font-semibold text-[#101828]">Engagement</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-px bg-[#EAECF0]">
                            <StatCard icon={<Eye size={18} />} label="Views" value={content.total_views ?? 0} color="blue" />
                            <StatCard icon={<Heart size={18} />} label="Likes" value={content.Likes?.length ?? 0} color="red" />
                            <StatCard icon={<MessageCircle size={18} />} label="Comments" value={content.Comments?.length ?? 0} color="purple" />
                            <StatCard icon={<Share2 size={18} />} label="Shares" value={content.total_shares ?? 0} color="emerald" />
                            <StatCard icon={<Bookmark size={18} />} label="Saves" value={content.total_saves ?? 0} color="orange" />
                        </div>
                    </div>

                    {/* Content Information */}
                    <div className="overflow-hidden rounded-[14px] border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.02)]">
                        <div className="flex items-center gap-3 border-b border-[#EAECF0] px-6 py-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#EFF6FF] text-[#2563EB]">
                                <IdCard size={17} />
                            </div>
                            <h2 className="text-[15px] font-semibold text-[#101828]">Content Information</h2>
                        </div>
                        <div className="divide-y divide-[#EAECF0]">
                            <InfoRow icon={<Hash size={15} />} label="Content ID" value={`#${content.social_id}`} />
                            <InfoRow icon={<MapPin size={15} />} label="Location" value={content.location || "N/A"} />
                            <InfoRow icon={<Globe size={15} />} label="Country" value={content.country || "N/A"} />
                            <InfoRow icon={<Users size={15} />} label="Audience" value={content.audience_type || "N/A"} />
                            <InfoRow icon={<CalendarDays size={15} />} label="Created" value={formatDate(content.createdAt)} />
                            <InfoRow icon={<Clock3 size={15} />} label="Time" value={formatTime(content.createdAt)} />
                        </div>
                    </div>

                    {/* Media Information */}
                    <div className="overflow-hidden rounded-[14px] border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.02)]">
                        <div className="flex items-center gap-3 border-b border-[#EAECF0] px-6 py-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#EFF6FF] text-[#2563EB]">
                                <Layers size={17} />
                            </div>
                            <h2 className="text-[15px] font-semibold text-[#101828]">Media Information</h2>
                        </div>
                        <div className="divide-y divide-[#EAECF0]">
                            <InfoRow icon={isReel ? <ReelIcon size={15} /> : <FileImage size={15} />} label="Type" value={content.social_type} />
                            <InfoRow icon={<Ruler size={15} />} label="Aspect Ratio" value={content.aspect_ratio || media?.aspect_ratio || "N/A"} />
                            <InfoRow icon={<Layers size={15} />} label="Video Height" value={content.video_hight ? `${content.video_hight}px` : "N/A"} />
                            <InfoRow icon={<Hash size={15} />} label="Media ID" value={media?.media_id ? `#${media.media_id}` : "N/A"} />
                        </div>
                    </div>

                    {/* Activity Timeline */}
                    <div className="overflow-hidden rounded-[14px] border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.02)]">
                        <div className="flex items-center gap-3 border-b border-[#EAECF0] px-6 py-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#EFF6FF] text-[#2563EB]">
                                <CalendarDays size={17} />
                            </div>
                            <h2 className="text-[15px] font-semibold text-[#101828]">Activity</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
                            <ActivityCard
                                icon={<CalendarDays size={18} />}
                                label="Published"
                                date={formatDate(content.createdAt)}
                                time={formatTime(content.createdAt)}
                                iconClass="bg-blue-50 text-blue-600"
                            />
                            <ActivityCard
                                icon={<Clock3 size={18} />}
                                label="Last Updated"
                                date={formatDate(content.updatedAt)}
                                time={formatTime(content.updatedAt)}
                                iconClass="bg-emerald-50 text-emerald-600"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};


/* ── STAT CARD ── */
const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-500",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-500",
};

function StatCard({ icon, label, value, color }: {
    icon: React.ReactNode; label: string; value: number; color: string;
}) {
    return (
        <div className="bg-white px-5 py-4">
            <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-[9px] ${colorMap[color] ?? "bg-gray-50 text-gray-500"}`}>
                {icon}
            </div>
            <p className="text-[22px] font-bold text-[#101828]">{value.toLocaleString("en-IN")}</p>
            <p className="mt-0.5 text-[12px] text-[#667085]">{label}</p>
        </div>
    );
}


/* ── INFO ROW ── */
function InfoRow({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string; }) {
    return (
        <div className="flex items-center justify-between gap-4 px-6 py-3.5">
            <div className="flex min-w-0 items-center gap-2">
                {icon && <span className="shrink-0 text-[#98A2B3]">{icon}</span>}
                <span className="text-[13px] text-[#667085]">{label}</span>
            </div>
            <span className="max-w-[55%] truncate text-right text-[13px] font-medium capitalize text-[#344054]" title={value}>
                {value}
            </span>
        </div>
    );
}


/* ── ACTIVITY CARD ── */
function ActivityCard({ icon, label, date, time, iconClass }: {
    icon: React.ReactNode; label: string; date: string; time: string; iconClass: string;
}) {
    return (
        <div className="flex items-center gap-3 rounded-[11px] border border-[#EAECF0] bg-[#F9FAFB] px-4 py-3.5">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] ${iconClass}`}>
                {icon}
            </div>
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#98A2B3]">{label}</p>
                <p className="mt-0.5 text-[13px] font-semibold text-[#344054]">{date}</p>
                {time && <p className="text-[12px] text-[#667085]">{time}</p>}
            </div>
        </div>
    );
}


export default ContentView;
