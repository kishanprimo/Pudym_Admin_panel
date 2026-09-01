"use client";

import { useEffect, useState } from "react";
import { Eye, Film, Image as ImageIcon, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import {
    fetchPosts,
    fetchReels,
    fetchTweets,
    fetchCampaigns,
    changeContentStatus,
} from "@/store/slices/ContentManagementSlices/contentManagementSlice";
import type { SocialContent } from "@/types/ContentManagementTypes/content.types";
import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

import Search from "@/components/common/Search";
import TableHeader from "@/components/common/TableHeader";
import Pagination from "@/components/common/Pagination";
import Action from "@/components/common/Action";
import DateTime from "@/components/common/DateTime";
import TableSkeleton from "@/components/common/TableSkeleton";
import TogglableSwitch from "@/components/common/TogglableSwitch";

interface ContentManagementProps {
    type: "post" | "reel" | "tweet" | "campaign";
}

const ContentManagement = ({
    type,
}: ContentManagementProps) => {

    const router = useRouter();
    const dispatch = useAppDispatch();

    /*
     * =========================================================
     * REDUX
     * =========================================================
     */

    const {
        posts,
        postsPagination,
        postsLoading,

        reels,
        reelsPagination,
        reelsLoading,

        tweets,
        tweetsPagination,
        tweetsLoading,

        campaigns,
        campaignsPagination,
        campaignsLoading,

        statusLoading,
        statusLoadingContentId,
    } = useAppSelector(
        (state) => state.contentManagement
    );


    /*
     * =========================================================
     * LOCAL STATE
     * =========================================================
     */

    const [searchInput, setSearchInput] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [rowsPerPage, setRowsPerPage] = useState(10);


    /*
     * =========================================================
     * SELECT CURRENT CONTENT
     * =========================================================
     */

    const content: SocialContent[] =
        type === "post"
            ? posts
            : type === "reel"
                ? reels
                : type === "tweet"
                    ? tweets
                    : campaigns.map((campaign) => ({
                        ...campaign.Social,
                        User: campaign.User,
                    }));

    const pagination =
        type === "post" ? postsPagination
            : type === "reel" ? reelsPagination
                : type === "tweet" ? tweetsPagination
                    : campaignsPagination;

    const loading =
        type === "post" ? postsLoading
            : type === "reel" ? reelsLoading
                : type === "tweet" ? tweetsLoading
                    : campaignsLoading;


    /*
     * =========================================================
     * FETCH DATA
     * =========================================================
     */

    useEffect(() => {

        const params = {
            page: currentPage,
            pageSize: rowsPerPage,
            search: searchTerm,
        };

        if (type === "post") {
            dispatch(fetchPosts(params));
        } else if (type === "reel") {
            dispatch(fetchReels(params));
        } else if (type === "tweet") {
            dispatch(fetchTweets(params));
        } else {
            dispatch(fetchCampaigns(params));
        }

    }, [
        dispatch,
        type,
        currentPage,
        rowsPerPage,
        searchTerm,
    ]);


    /*
     * =========================================================
     * SEARCH
     * =========================================================
     */

    const handleSearchChange = (
        value: string
    ) => {

        setSearchInput(value);

    };


    useEffect(() => {
        const timer = setTimeout(() => {
            const trimmedSearch = searchInput.trim();

            setSearchTerm(trimmedSearch);
            setCurrentPage(1);
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [searchInput]);


    /*
     * =========================================================
     * PAGINATION
     * =========================================================
     */

    const handlePageChange = (
        page: number
    ) => {

        setCurrentPage(page);

    };


    const handleRowsPerPageChange = (
        rows: number
    ) => {

        setRowsPerPage(rows);

        setCurrentPage(1);

    };


    /*
     * =========================================================
     * VIEW CONTENT
     * =========================================================
     */

    const handleView = (socialId: number) => {
        if (type === "campaign") {
            // For campaigns, socialId here is actually campaign_id (passed from row)
            router.push(`/ContentManagement/campaign-view?campaign_id=${socialId}`);
        } else {
            router.push(`/ContentManagement/content-view?social_id=${socialId}`);
        }
    };


    /*
     * =========================================================
     * STATUS
     * =========================================================
     */

    const handleStatusChange = async (
        socialId: number,
        status: boolean
    ) => {

        const result = await dispatch(
            changeContentStatus({
                socialId,
                status,
            })
        );


        if (
            changeContentStatus.fulfilled.match(
                result
            )
        ) {

            toast.success(
                status
                    ? "Content activated successfully"
                    : "Content deactivated successfully"
            );

        } else {

            toast.error(
                result.payload ||
                "Failed to update content status"
            );

        }

    };


    /*
     * =========================================================
     * FORMATTERS
     * =========================================================
     */

    const formatDate = (
        date: string
    ) => {

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


    const formatTime = (
        date: string
    ) => {

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


    const getAvatarText = (
        user: any
    ) => {

        const name =
            user?.full_name ||
            user?.user_name ||
            "User";

        const words = name
            .trim()
            .split(/\s+/)
            .filter(Boolean);


        if (words.length >= 2) {

            return `${words[0][0]}${words[1][0]}`
                .toUpperCase();

        }


        return words[0]
            .slice(0, 2)
            .toUpperCase();

    };

    const getMediaUrl = (url?: string) => {
        if (!url) return "";

        // Convert markdown-style URL:
        // [http://example.com/file.mp4](http://example.com/file.mp4)
        // into:
        // http://example.com/file.mp4
        const markdownMatch = url.match(/^\[.*?\]\((.*?)\)$/);

        return markdownMatch ? markdownMatch[1] : url;
    };
    /*
     * =========================================================
     * TABLE COLUMNS
     * =========================================================
     */

    const isTweetOrCampaign =
        type === "tweet" || type === "campaign";

    const columns = [
        { label: "Media", width: "100px" },
        { label: "Creator", width: "220px" },
        {
            label: type === "campaign" ? "Title" : "Description",
            width: "300px",
        },
        { label: "Location", width: "180px" },
        { label: "Views", width: "100px" },

        ...(!isTweetOrCampaign
            ? [{ label: "Status", width: "130px" }]
            : []),

        { label: "Created At", width: "160px" },
        {
            label: "Action",
            width: "120px",
            className: "text-center",
        },
    ];

    /*
     * =========================================================
     * PAGE TITLE
     * =========================================================
     */

    const title =
        type === "post" ? "Posts"
            : type === "reel" ? "Reels"
                : type === "tweet" ? "Tweets"
                    : "Campaigns";

    const description =
        type === "post" ? "Manage and monitor all published posts."
            : type === "reel" ? "Manage and monitor all published reels."
                : type === "tweet" ? "Manage and monitor all published tweets."
                    : "Manage and monitor all campaigns.";




    return (

        <div className="px-5 py-5 md:px-6 lg:px-7">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <h1 className="text-[28px] font-semibold text-[#101828]">
                        {title}
                    </h1>

                    <p className="mt-1 text-[14px] text-[#667085]">
                        {description}
                    </p>

                </div>


                <div className="w-full lg:w-[305px]">

                    <Search
                        searchTerm={searchInput}
                        setSearchTerm={
                            handleSearchChange
                        }
                        placeholder={`Search ${title.toLowerCase()} by Creator...`}
                    />

                </div>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="overflow-hidden rounded-[10px] border border-[#EAECF0] bg-white">

                <div className="w-full overflow-x-auto">

                    <table className="w-full min-w-[1300px] border-collapse text-left">

                        <TableHeader
                            columns={columns}
                            showCheckbox={false}
                        />


                        <tbody className="divide-y divide-[#EAECF0]">

                            {loading ? (

                                <TableSkeleton
                                    rows={rowsPerPage}
                                />

                            ) : content.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={isTweetOrCampaign ? 7 : 8}
                                        className="px-6 py-16 text-center"
                                    >

                                        <div className="flex flex-col items-center justify-center">

                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF]">

                                                {type === "post" ? (

                                                    <ImageIcon
                                                        size={22}
                                                        className="text-[#2563EB]"
                                                    />

                                                ) : (

                                                    <Film
                                                        size={22}
                                                        className="text-[#2563EB]"
                                                    />

                                                )}

                                            </div>


                                            <p className="text-[15px] font-semibold text-[#101828]">
                                                No {title.toLowerCase()} found
                                            </p>


                                            <p className="mt-1 text-[13px] text-[#667085]">
                                                Try changing your search.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                content.map((item) => {

                                    const creator =
                                        item.User;


                                    const media =
                                        item.Media?.[0];


                                    const isStatusLoading =
                                        statusLoading &&
                                        statusLoadingContentId === item.social_id;

                                    // For campaigns, the row item is the Social object;
                                    // we need campaign_id for view routing.
                                    const viewId = type === "campaign"
                                        ? campaigns.find((c) => c.social_id === item.social_id)?.campaign_id ?? item.social_id
                                        : item.social_id;


                                    return (

                                        <tr
                                            key={item.social_id}
                                            className="transition-colors hover:bg-[#F9FAFB]"
                                        >

                                            {/* =================================================
    MEDIA
================================================= */}

                                            <td className="px-5 py-4">

                                                {media?.media_location ? (() => {

                                                    const mediaUrl = getMediaUrl(
                                                        media.media_location
                                                    );

                                                    const isVideo =
                                                        type === "reel" ||
                                                        type === "campaign";

                                                    return isVideo ? (

                                                        <video
                                                            src={mediaUrl}
                                                            className="h-12 w-12 rounded-[8px] border border-gray-200 object-cover"
                                                            muted
                                                            playsInline
                                                            preload="metadata"
                                                        />

                                                    ) : (

                                                        <img
                                                            src={mediaUrl}
                                                            alt="Media"
                                                            className="h-12 w-12 rounded-[8px] border border-gray-200 object-cover"
                                                        />

                                                    );

                                                })() : (

                                                    <div className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-[#D0D5DD] bg-[#F9FAFB]">

                                                        <ImageIcon
                                                            size={20}
                                                            className="text-[#98A2B3]"
                                                        />

                                                    </div>

                                                )}

                                            </td>


                                            {/* =================================================
                                                CREATOR
                                            ================================================= */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-3">

                                                    {creator?.profile_pic ? (

                                                        <img
                                                            src={
                                                                creator.profile_pic
                                                            }
                                                            alt={
                                                                creator.full_name ||
                                                                "Creator"
                                                            }
                                                            className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                                                        />

                                                    ) : (

                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D0D5DD] bg-[#EFF6FF] text-[12px] font-semibold text-[#2563EB]">

                                                            {getAvatarText(
                                                                creator
                                                            )}

                                                        </div>

                                                    )}


                                                    <div className="min-w-0">

                                                        <p className="truncate text-[14px] font-semibold text-[#101828]">

                                                            {creator?.full_name ||
                                                                "Unknown"}

                                                        </p>


                                                        <p className="mt-1 truncate text-[12px] text-[#667085]">

                                                            {creator?.user_name
                                                                ? `@${creator.user_name.replace(/^@/, "")}`
                                                                : "N/A"}

                                                        </p>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* =================================================
                                                DESCRIPTION
                                            ================================================= */}

                                            <td className="px-5 py-4">

                                                <p
                                                    className="max-w-[300px] truncate text-[13px] text-[#475467]"
                                                    title={
                                                        item.social_desc ||
                                                        ""
                                                    }
                                                >

                                                    {item.social_desc ||
                                                        "No description"}

                                                </p>

                                            </td>


                                            {/* =================================================
                                                LOCATION
                                            ================================================= */}

                                            <td className="px-5 py-4">

                                                <div className="flex max-w-[180px] items-start gap-2">

                                                    <MapPin
                                                        size={14}
                                                        className="mt-0.5 shrink-0 text-[#98A2B3]"
                                                    />

                                                    <p className="truncate text-[13px] text-[#475467]">

                                                        {item.location ||
                                                            "N/A"}

                                                    </p>

                                                </div>

                                            </td>


                                            {/* =================================================
                                                VIEWS
                                            ================================================= */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-2">

                                                    <Eye
                                                        size={15}
                                                        className="text-[#98A2B3]"
                                                    />

                                                    <span className="text-[13px] text-[#475467]">

                                                        {item.total_views ??
                                                            0}

                                                    </span>

                                                </div>

                                            </td>


                                            {/* STATUS — hidden for tweet/campaign */}
                                            {!isTweetOrCampaign && (
                                                <td className="px-5 py-4">

                                                    <TogglableSwitch
                                                        isActive={item.status}
                                                        onToggle={() =>
                                                            handleStatusChange(
                                                                item.social_id,
                                                                !item.status
                                                            )
                                                        }
                                                        loading={isStatusLoading}
                                                    />

                                                </td>
                                            )}

                                            {/* =================================================
                                                CREATED AT
                                            ================================================= */}

                                            <td className="px-5 py-4">

                                                <DateTime
                                                    date={formatDate(
                                                        item.createdAt
                                                    )}
                                                    time={formatTime(
                                                        item.createdAt
                                                    )}
                                                />

                                            </td>


                                            {/* =================================================
                                                ACTION
                                            ================================================= */}

                                            <td className="px-5 py-4">

                                                <div className="flex justify-center">

                                                    <Action
                                                        showView
                                                        showDelete={false}
                                                        showEdit={false}
                                                        onView={() => handleView(viewId)}
                                                    />

                                                </div>

                                            </td>

                                        </tr>

                                    );

                                })

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* =================================================
                PAGINATION
            ================================================= */}

            {!loading &&
                pagination.total_pages > 0 && (

                    <div className="mt-5 w-full">

                        <Pagination
                            currentPage={
                                pagination.current_page
                            }
                            totalPages={
                                pagination.total_pages
                            }
                            rowsPerPage={
                                pagination.records_per_page
                            }
                            onPageChange={
                                handlePageChange
                            }
                            onRowsPerPageChange={
                                handleRowsPerPageChange
                            }
                            rowsPerPageOptions={[
                                5,
                                10,
                                20,
                                50,
                            ]}
                            showRowsPerPage
                            showPageInfo
                        />

                    </div>

                )}

        </div>

    );
};


export default ContentManagement;