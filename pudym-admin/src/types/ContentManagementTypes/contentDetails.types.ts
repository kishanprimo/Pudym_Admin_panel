import type {
    SocialContent,
    ContentUser,
} from "./content.types";

export interface ContentLike {
    like_id: number;
    like_by: number | null;
    social_id: number | null;
    comment_id: number | null;
    User?: ContentUser;
}

export interface ContentComment {
    comment_id: number;
    social_id: number;
    comment_by?: number;
    comment_text?: string;
    createdAt?: string;
    updatedAt?: string;
    commenter?: ContentUser;
}

export interface ContentDetails
    extends SocialContent {
    Likes: ContentLike[];
    Comments: ContentComment[];
}

export interface GetContentDetailsResponse {
    success: boolean;
    message: string;
    data: ContentDetails;
}