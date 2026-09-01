import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getPosts } from "@/store/api/ContentManagementApi/getPosts.api";
import { getReels } from "@/store/api/ContentManagementApi/getReels.api";
import { getTweets } from "@/store/api/ContentManagementApi/getTweets.api";
import { getCampaigns } from "@/store/api/ContentManagementApi/getCampaigns.api";
import { getCampaignDetails } from "@/store/api/ContentManagementApi/getCampaignDetails.api";
import { getContentDetails } from "@/store/api/ContentManagementApi/getContentDetails.api";
import { updateContentStatus } from "@/store/api/ContentManagementApi/updateContentStatus.api";

import type {
    SocialContent,
    ContentPagination as SocialContentPagination,
} from "@/types/ContentManagementTypes/content.types";

import type {
    ContentDetails as SocialContentDetails,
} from "@/types/ContentManagementTypes/contentDetails.types";

import type {
    Campaign,
} from "@/types/ContentManagementTypes/campaign.types";


/*
 * =========================================================
 * STATE
 * =========================================================
 */

interface ContentManagementState {

    /*
     * Posts
     */
    posts: SocialContent[];

    postsPagination: SocialContentPagination;

    postsLoading: boolean;

    postsError: string | null;


    /*
     * Reels
     */
    reels: SocialContent[];

    reelsPagination: SocialContentPagination;

    reelsLoading: boolean;

    reelsError: string | null;


    /*
     * Tweets
     */
    tweets: SocialContent[];

    tweetsPagination: SocialContentPagination;

    tweetsLoading: boolean;

    tweetsError: string | null;


    /*
     * Campaigns
     */
    campaigns: Campaign[];

    campaignsPagination: SocialContentPagination;

    campaignsLoading: boolean;

    campaignsError: string | null;


    /*
     * Campaign Details
     */
    selectedCampaign: Campaign | null;

    campaignDetailsLoading: boolean;

    campaignDetailsError: string | null;


    /*
     * Content Details
     */
    selectedContent: SocialContentDetails | null;

    detailsLoading: boolean;

    detailsError: string | null;


    /*
     * Activate / Deactivate
     */
    statusLoading: boolean;

    statusLoadingContentId: number | null;

    statusError: string | null;
}


/*
 * =========================================================
 * INITIAL STATE
 * =========================================================
 */

const initialPagination: SocialContentPagination = {
    total_pages: 0,
    total_records: 0,
    current_page: 1,
    records_per_page: 10,
};


const initialState: ContentManagementState = {

    /*
     * Posts
     */
    posts: [],

    postsPagination: initialPagination,

    postsLoading: false,

    postsError: null,


    /*
     * Reels
     */
    reels: [],

    reelsPagination: {
        ...initialPagination,
    },

    reelsLoading: false,

    reelsError: null,


    /*
     * Tweets
     */
    tweets: [],

    tweetsPagination: { ...initialPagination },

    tweetsLoading: false,

    tweetsError: null,


    /*
     * Campaigns
     */
    campaigns: [],

    campaignsPagination: { ...initialPagination },

    campaignsLoading: false,

    campaignsError: null,


    /*
     * Campaign Details
     */
    selectedCampaign: null,

    campaignDetailsLoading: false,

    campaignDetailsError: null,


    /*
     * Details
     */
    selectedContent: null,

    detailsLoading: false,

    detailsError: null,


    /*
     * Status
     */
    statusLoading: false,

    statusLoadingContentId: null,

    statusError: null,
};


/*
 * =========================================================
 * FETCH POSTS
 * =========================================================
 */

export const fetchPosts = createAsyncThunk<
    Awaited<ReturnType<typeof getPosts>>,
    {
        page?: number;
        pageSize?: number;
        search?: string;
    },
    { rejectValue: string }
>(
    "contentManagement/fetchPosts",

    async (params, { rejectWithValue }) => {

        try {

            return await getPosts(params);

        } catch (error) {

            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch posts"
            );

        }
    }
);


/*
 * =========================================================
 * FETCH TWEETS
 * =========================================================
 */

export const fetchTweets = createAsyncThunk<
    Awaited<ReturnType<typeof getTweets>>,
    { page?: number; pageSize?: number; search?: string; },
    { rejectValue: string }
>(
    "contentManagement/fetchTweets",
    async (params, { rejectWithValue }) => {
        try {
            return await getTweets(params);
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch tweets");
        }
    }
);


/*
 * =========================================================
 * FETCH CAMPAIGNS
 * =========================================================
 */

export const fetchCampaigns = createAsyncThunk<
    Awaited<ReturnType<typeof getCampaigns>>,
    { page?: number; pageSize?: number; search?: string; },
    { rejectValue: string }
>(
    "contentManagement/fetchCampaigns",
    async (params, { rejectWithValue }) => {
        try {
            return await getCampaigns(params);
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch campaigns");
        }
    }
);


/*
 * =========================================================
 * FETCH CAMPAIGN DETAILS
 * =========================================================
 */

export const fetchCampaignDetails = createAsyncThunk<
    Awaited<ReturnType<typeof getCampaignDetails>>,
    number,
    { rejectValue: string }
>(
    "contentManagement/fetchCampaignDetails",
    async (campaignId, { rejectWithValue }) => {
        try {
            return await getCampaignDetails(campaignId);
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch campaign details");
        }
    }
);


/*
 * =========================================================
 * FETCH REELS
 * =========================================================
 */

export const fetchReels = createAsyncThunk<
    Awaited<ReturnType<typeof getReels>>,
    {
        page?: number;
        pageSize?: number;
        search?: string;
    },
    { rejectValue: string }
>(
    "contentManagement/fetchReels",

    async (params, { rejectWithValue }) => {

        try {

            return await getReels(params);

        } catch (error) {

            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch reels"
            );

        }
    }
);


/*
 * =========================================================
 * FETCH CONTENT DETAILS
 * =========================================================
 */

export const fetchContentDetails = createAsyncThunk<
    Awaited<ReturnType<typeof getContentDetails>>,
    number,
    { rejectValue: string }
>(
    "contentManagement/fetchContentDetails",

    async (socialId, { rejectWithValue }) => {

        try {

            return await getContentDetails(socialId);

        } catch (error) {

            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch content details"
            );

        }
    }
);


/*
 * =========================================================
 * ACTIVATE / DEACTIVATE CONTENT
 * =========================================================
 */

export const changeContentStatus = createAsyncThunk<
    Awaited<ReturnType<typeof updateContentStatus>>,
    {
        socialId: number;
        status: boolean;
    },
    { rejectValue: string }
>(
    "contentManagement/changeContentStatus",

    async (
        { socialId, status },
        { rejectWithValue }
    ) => {

        try {

            return await updateContentStatus(
                socialId,
                status
            );

        } catch (error) {

            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : "Failed to update content status"
            );

        }
    }
);


/*
 * =========================================================
 * SLICE
 * =========================================================
 */

const contentManagementSlice = createSlice({

    name: "contentManagement",

    initialState,

    reducers: {

        /*
         * Clear selected content
         */
        clearSelectedContent: (state) => {

            state.selectedContent = null;

            state.detailsError = null;

        },


        /*
         * Clear selected campaign
         */
        clearSelectedCampaign: (state) => {

            state.selectedCampaign = null;

            state.campaignDetailsError = null;

        },


        /*
         * Clear posts error
         */
        clearPostsError: (state) => {

            state.postsError = null;

        },


        /*
         * Clear reels error
         */
        clearReelsError: (state) => {

            state.reelsError = null;

        },


        /*
         * Clear details error
         */
        clearDetailsError: (state) => {

            state.detailsError = null;

        },


        /*
         * Clear status error
         */
        clearStatusError: (state) => {

            state.statusError = null;

        },


        clearTweetsError: (state) => { state.tweetsError = null; },

        clearCampaignsError: (state) => { state.campaignsError = null; },

    },


    extraReducers: (builder) => {


        /*
         * =================================================
         * GET POSTS
         * =================================================
         */

        builder

            .addCase(fetchPosts.pending, (state) => {

                state.postsLoading = true;

                state.postsError = null;

            })

            .addCase(fetchPosts.fulfilled, (state, action) => {

                state.postsLoading = false;

                if (action.payload.success) {

                    state.posts =
                        action.payload.data.Records;

                    state.postsPagination =
                        action.payload.data.Pagination;

                }

            })

            .addCase(fetchPosts.rejected, (state, action) => {

                state.postsLoading = false;

                state.postsError =
                    action.payload ||
                    "Failed to fetch posts";

            });


        /*
         * =================================================
         * GET TWEETS
         * =================================================
         */

        builder
            .addCase(fetchTweets.pending, (state) => {
                state.tweetsLoading = true;
                state.tweetsError = null;
            })
            .addCase(fetchTweets.fulfilled, (state, action) => {
                state.tweetsLoading = false;
                if (action.payload.success) {
                    state.tweets = action.payload.data.Records;
                    state.tweetsPagination = action.payload.data.Pagination;
                }
            })
            .addCase(fetchTweets.rejected, (state, action) => {
                state.tweetsLoading = false;
                state.tweetsError = action.payload || "Failed to fetch tweets";
            });


        /*
         * =================================================
         * GET CAMPAIGNS
         * =================================================
         */

        builder
            .addCase(fetchCampaigns.pending, (state) => {
                state.campaignsLoading = true;
                state.campaignsError = null;
            })
            .addCase(fetchCampaigns.fulfilled, (state, action) => {
                state.campaignsLoading = false;
                if (action.payload.success) {
                    state.campaigns = action.payload.data.Records;
                    state.campaignsPagination = action.payload.data.Pagination;
                }
            })
            .addCase(fetchCampaigns.rejected, (state, action) => {
                state.campaignsLoading = false;
                state.campaignsError = action.payload || "Failed to fetch campaigns";
            });


        /*
         * =================================================
         * GET CAMPAIGN DETAILS
         * =================================================
         */

        builder
            .addCase(fetchCampaignDetails.pending, (state) => {
                state.campaignDetailsLoading = true;
                state.campaignDetailsError = null;
                state.selectedCampaign = null;
            })
            .addCase(fetchCampaignDetails.fulfilled, (state, action) => {
                state.campaignDetailsLoading = false;
                if (action.payload.success) {
                    state.selectedCampaign = action.payload.data;
                }
            })
            .addCase(fetchCampaignDetails.rejected, (state, action) => {
                state.campaignDetailsLoading = false;
                state.campaignDetailsError = action.payload || "Failed to fetch campaign details";
            });


        /*
         * =================================================
         * GET REELS
         * =================================================
         */

        builder

            .addCase(fetchReels.pending, (state) => {

                state.reelsLoading = true;

                state.reelsError = null;

            })

            .addCase(fetchReels.fulfilled, (state, action) => {

                state.reelsLoading = false;

                if (action.payload.success) {

                    state.reels =
                        action.payload.data.Records;

                    state.reelsPagination =
                        action.payload.data.Pagination;

                }

            })

            .addCase(fetchReels.rejected, (state, action) => {

                state.reelsLoading = false;

                state.reelsError =
                    action.payload ||
                    "Failed to fetch reels";

            });


        /*
         * =================================================
         * GET CONTENT DETAILS
         * =================================================
         */

        builder

            .addCase(fetchContentDetails.pending, (state) => {

                state.detailsLoading = true;

                state.detailsError = null;

                state.selectedContent = null;

            })

            .addCase(fetchContentDetails.fulfilled, (state, action) => {

                state.detailsLoading = false;

                if (action.payload.success) {

                    state.selectedContent =
                        action.payload.data;

                }

            })

            .addCase(fetchContentDetails.rejected, (state, action) => {

                state.detailsLoading = false;

                state.detailsError =
                    action.payload ||
                    "Failed to fetch content details";

            });


        /*
         * =================================================
         * ACTIVATE / DEACTIVATE CONTENT
         * =================================================
         */

        builder

            .addCase(changeContentStatus.pending, (state, action) => {

                state.statusLoading = true;

                state.statusLoadingContentId =
                    action.meta.arg.socialId;

                state.statusError = null;

            })

            .addCase(changeContentStatus.fulfilled, (state, action) => {

                state.statusLoading = false;

                state.statusLoadingContentId = null;

                if (!action.payload.success) {
                    return;
                }

                const updatedContent =
                    action.payload.data;


                /*
                 * -----------------------------------------
                 * Update Posts list
                 * -----------------------------------------
                 */

                const post =
                    state.posts.find(
                        (item) =>
                            item.social_id ===
                            updatedContent.social_id
                    );

                if (post) {

                    post.status =
                        updatedContent.status;

                }


                /*
                 * -----------------------------------------
                 * Update Reels list
                 * -----------------------------------------
                 */

                const reel =
                    state.reels.find(
                        (item) =>
                            item.social_id ===
                            updatedContent.social_id
                    );

                if (reel) {

                    reel.status =
                        updatedContent.status;

                }


                /*
                 * -----------------------------------------
                 * Update opened details
                 * -----------------------------------------
                 */

                if (
                    state.selectedContent?.social_id ===
                    updatedContent.social_id
                ) {

                    state.selectedContent.status =
                        updatedContent.status;

                }

            })

            .addCase(changeContentStatus.rejected, (state, action) => {

                state.statusLoading = false;

                state.statusLoadingContentId = null;

                state.statusError =
                    action.payload ||
                    "Failed to update content status";

            });

    },
});


/*
 * =========================================================
 * ACTIONS
 * =========================================================
 */

export const {
    clearSelectedContent,
    clearSelectedCampaign,
    clearPostsError,
    clearReelsError,
    clearTweetsError,
    clearCampaignsError,
    clearDetailsError,
    clearStatusError,
} = contentManagementSlice.actions;


/*
 * =========================================================
 * REDUCER
 * =========================================================
 */

export default contentManagementSlice.reducer;