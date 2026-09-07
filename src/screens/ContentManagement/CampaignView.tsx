"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ArrowLeft,
    Eye,
    Film,
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
    Target,
    TrendingUp,
    Layers,
    Ruler,
    IdCard,
    BadgeDollarSign,
} from "lucide-react";

import {
    fetchCampaignDetails,
    clearSelectedCampaign,
} from "@/store/slices/ContentManagementSlices/contentManagementSlice";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Tags from "@/components/common/Tags";


const CampaignView = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    const campaignIdParam = searchParams.get("campaign_id");
    const campaignId = campaignIdParam ? Number(campaignIdParam) : null;

    const {
        selectedCampaign,
        campaignDetailsLoading,
        campaignDetailsError,
    } = useAppSelector((state) => state.contentManagement);

    useEffect(() => {
        if (campaignId === null || Number.isNaN(campaignId)) return;
        dispatch(fetchCampaignDetails(campaignId));
        return () => { dispatch(clearSelectedCampaign()); };
    }, [dispatch, campaignId]);

    const formatDate = (date?: string | null) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    };

    const formatTime = (date?: string | null) => {
        if (!date) return "";
        return new Date(date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    };

    const getAvatarText = (user: any) => {
        const name = user?.full_name || user?.user_name || "User";
        const words = name.trim().split(/\s+/).filter(Boolean);
        if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
        return words[0]?.slice(0, 2).toUpperCase() || "US";
    };

    /* ── LOADING ── */
    if (campaignDetailsLoading) {
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
    if (campaignDetailsError || !selectedCampaign) {
        return (
            <div className="px-5 py-5 md:px-6 lg:px-7">
                <button type="button" onClick={() => router.back()}
                    className="mb-6 flex cursor-pointer items-center gap-2 text-[13px] font-medium text-[#667085] transition-colors hover:text-[#101828]">
                    <ArrowLeft size={16} /> Back to Campaigns
                </button>
                <div className="flex min-h-[450px] items-center justify-center rounded-[16px] border border-[#EAECF0] bg-white">
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                            <Target size={26} className="text-red-500" />
                        </div>
                        <h2 className="text-[18px] font-semibold text-[#101828]">Unable to load campaign</h2>
                        <p className="mt-2 text-[14px] text-[#667085]">{campaignDetailsError || "Campaign details were not found."}</p>
                        <button type="button" onClick={() => router.back()}
                            className="mt-5 rounded-[8px] bg-[#2563EB] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-blue-700">
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const campaign = selectedCampaign;
    const social = campaign.Social;
    const creator = campaign.User;
    const media = social?.Media?.[0];
    const isVideo = campaign.post_type === "video";

    const goalAmount = parseFloat(campaign.goal_amount || "0");
    const raisedAmount = parseFloat(campaign.raised_amount || "0");
    const progressPct = goalAmount > 0 ? Math.min((raisedAmount / goalAmount) * 100, 100) : 0;

    return (
        <div className="min-h-full px-5 py-5 md:px-6 lg:px-7">

            {/* ── BACK ── */}
            <button type="button" onClick={() => router.back()}
                className="mb-6 flex cursor-pointer items-center gap-2 text-[13px] font-medium text-[#667085] transition-colors hover:text-[#101828]">
                <ArrowLeft size={16} />
                Back to Campaigns
            </button>

            {/* ── PAGE TITLE ── */}
            <div className="mb-6">
                <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#101828]">Campaign Details</h1>
                <p className="mt-1 text-[14px] text-[#667085]">View campaign information and performance metrics.</p>
            </div>

            {/* ── HERO BANNER ── */}
            <div className="mb-6 overflow-hidden rounded-[16px] border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
                <div className="h-[88px] bg-gradient-to-r from-[#EFF6FF] via-[#F5F8FF] to-[#F8FAFC]" />
                <div className="px-6 pb-6">
                    <div className="-mt-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                        <div className="flex items-end gap-5">
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
                                    {campaign.title || "Untitled Campaign"}
                                </h2>
                                <p className="mt-0.5 text-[13px] text-[#667085]">
                                    {creator?.user_name ? `@${creator.user_name.replace(/^@/, "")}` : "N/A"}
                                </p>
                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <Tags
                                        text={campaign.status === "active" ? "Active" : campaign.status}
                                        variant={campaign.status === "active" ? "emerald" : "orange"}
                                    />
                                    <Tags text="Campaign" variant="purple" />
                                    {campaign.is_unlimited && <Tags text="Unlimited" variant="blue" />}
                                </div>
                            </div>
                        </div>
                        <div className="rounded-[10px] border border-[#EAECF0] bg-[#F9FAFB] px-4 py-2.5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#98A2B3]">Campaign ID</p>
                            <p className="mt-0.5 text-[14px] font-semibold text-[#101828]">#{campaign.campaign_id}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MAIN GRID ── */}
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(340px,1fr)]">

                {/* ── LEFT ── */}
                <div className="space-y-6">

                    {/* Media */}
                    <div className="overflow-hidden rounded-[14px] border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.02)]">
                        <div className="flex items-center gap-3 border-b border-[#EAECF0] px-6 py-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#EFF6FF] text-[#2563EB]">
                                {isVideo ? <Film size={17} /> : <ImageIcon size={17} />}
                            </div>
                            <h2 className="text-[15px] font-semibold text-[#101828]">Campaign Media</h2>
                        </div>
                        <div className="flex min-h-[480px] items-center justify-center bg-[#F9FAFB] p-6">
                            {media?.media_location ? (
                                isVideo ? (
                                    <video src={media.media_location} controls playsInline
                                        className="max-h-[580px] max-w-full rounded-[12px] object-contain shadow-md" />
                                ) : (
                                    <img src={media.media_location} alt="Campaign media"
                                        className="max-h-[580px] max-w-full rounded-[12px] object-contain shadow-md" />
                                )
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2F4F7]">
                                        <Target size={30} className="text-[#98A2B3]" />
                                    </div>
                                    <p className="text-[14px] font-medium text-[#475467]">Media unavailable</p>
                                    <p className="mt-1 text-[12px] text-[#98A2B3]">No media file attached to this campaign.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="overflow-hidden rounded-[14px] border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.02)]">
                        <div className="flex items-center gap-3 border-b border-[#EAECF0] px-6 py-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#EFF6FF] text-[#2563EB]">
                                <MessageCircle size={17} />
                            </div>
                            <h2 className="text-[15px] font-semibold text-[#101828]">Description</h2>
                        </div>
                        <div className="px-6 py-5">
                            <p className="whitespace-pre-wrap break-words text-[14px] leading-7 text-[#344054]">
                                {campaign.description || <span className="italic text-[#98A2B3]">No description provided.</span>}
                            </p>
                            {social?.campaign_goal && (
                                <div className="mt-5">
                                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#98A2B3]">Campaign Goal</p>
                                    <p className="text-[14px] leading-6 text-[#344054]">{social.campaign_goal}</p>
                                </div>
                            )}
                            {social?.hashtag && social.hashtag.length > 0 && (
                                <div className="mt-5">
                                    <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#98A2B3]">Hashtags</p>
                                    <div className="flex flex-wrap gap-2">
                                        {social.hashtag.map((tag, i) => (
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

                    {/* Funding Progress */}
                    <div className="overflow-hidden rounded-[14px] border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.02)]">
                        <div className="flex items-center gap-3 border-b border-[#EAECF0] px-6 py-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#EFF6FF] text-[#2563EB]">
                                <TrendingUp size={17} />
                            </div>
                            <h2 className="text-[15px] font-semibold text-[#101828]">Funding Progress</h2>
                        </div>
                        <div className="px-6 py-5">
                            <div className="mb-3 flex items-end justify-between">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#98A2B3]">Raised</p>
                                    <p className="mt-0.5 text-[22px] font-bold text-[#101828]">${raisedAmount.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#98A2B3]">Goal</p>
                                    <p className="mt-0.5 text-[16px] font-semibold text-[#344054]">
                                        {campaign.is_unlimited ? "Unlimited" : `$${goalAmount.toLocaleString()}`}
                                    </p>
                                </div>
                            </div>
                            {!campaign.is_unlimited && (
                                <>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#EAECF0]">
                                        <div
                                            className="h-full rounded-full bg-[#2563EB] transition-all"
                                            style={{ width: `${progressPct}%` }}
                                        />
                                    </div>
                                    <p className="mt-2 text-right text-[12px] font-medium text-[#667085]">{progressPct.toFixed(1)}% funded</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT ── */}
                <div className="space-y-6">

                    {/* Engagement */}
                    <div className="overflow-hidden rounded-[14px] border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.02)]">
                        <div className="flex items-center gap-3 border-b border-[#EAECF0] px-6 py-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#EFF6FF] text-[#2563EB]">
                                <Eye size={17} />
                            </div>
                            <h2 className="text-[15px] font-semibold text-[#101828]">Engagement</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-px bg-[#EAECF0]">
                            <StatCard icon={<Eye size={18} />} label="Views" value={social?.total_views ?? 0} color="blue" />
                            <StatCard icon={<Share2 size={18} />} label="Shares" value={social?.total_shares ?? 0} color="emerald" />
                            <StatCard icon={<Bookmark size={18} />} label="Saves" value={social?.total_saves ?? 0} color="orange" />
                            <StatCard icon={<BadgeDollarSign size={18} />} label="Raised" value={raisedAmount} color="purple" prefix="$" />
                        </div>
                    </div>

                    {/* Campaign Information */}
                    <div className="overflow-hidden rounded-[14px] border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.02)]">
                        <div className="flex items-center gap-3 border-b border-[#EAECF0] px-6 py-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#EFF6FF] text-[#2563EB]">
                                <IdCard size={17} />
                            </div>
                            <h2 className="text-[15px] font-semibold text-[#101828]">Campaign Information</h2>
                        </div>
                        <div className="divide-y divide-[#EAECF0]">
                            <InfoRow icon={<Hash size={15} />} label="Campaign ID" value={`#${campaign.campaign_id}`} />
                            <InfoRow icon={<Target size={15} />} label="Post Type" value={campaign.post_type} />
                            <InfoRow icon={<MapPin size={15} />} label="Location" value={social?.location || "N/A"} />
                            <InfoRow icon={<Globe size={15} />} label="Country" value={social?.country || "N/A"} />
                            <InfoRow icon={<Users size={15} />} label="Audience" value={social?.audience_type || "N/A"} />
                            <InfoRow icon={<CalendarDays size={15} />} label="End Date" value={formatDate(campaign.end_date)} />
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
                            <InfoRow icon={<Ruler size={15} />} label="Aspect Ratio" value={social?.aspect_ratio || media?.aspect_ratio || "N/A"} />
                            <InfoRow icon={<Layers size={15} />} label="Video Height" value={social?.video_hight ? `${social.video_hight}px` : "N/A"} />
                            <InfoRow icon={<Hash size={15} />} label="Media ID" value={media?.media_id ? `#${media.media_id}` : "N/A"} />
                        </div>
                    </div>

                    {/* Activity */}
                    <div className="overflow-hidden rounded-[14px] border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.02)]">
                        <div className="flex items-center gap-3 border-b border-[#EAECF0] px-6 py-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#EFF6FF] text-[#2563EB]">
                                <CalendarDays size={17} />
                            </div>
                            <h2 className="text-[15px] font-semibold text-[#101828]">Activity</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
                            <ActivityCard icon={<CalendarDays size={18} />} label="Created"
                                date={formatDate(campaign.created_at)} time={formatTime(campaign.created_at)}
                                iconClass="bg-blue-50 text-blue-600" />
                            <ActivityCard icon={<Clock3 size={18} />} label="Last Updated"
                                date={formatDate(campaign.updated_at)} time={formatTime(campaign.updated_at)}
                                iconClass="bg-emerald-50 text-emerald-600" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};


const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-500",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-500",
};

function StatCard({ icon, label, value, color, prefix = "" }: {
    icon: React.ReactNode; label: string; value: number; color: string; prefix?: string;
}) {
    return (
        <div className="bg-white px-5 py-4">
            <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-[9px] ${colorMap[color] ?? "bg-gray-50 text-gray-500"}`}>
                {icon}
            </div>
            <p className="text-[22px] font-bold text-[#101828]">{prefix}{value.toLocaleString("en-IN")}</p>
            <p className="mt-0.5 text-[12px] text-[#667085]">{label}</p>
        </div>
    );
}

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

export default CampaignView;
