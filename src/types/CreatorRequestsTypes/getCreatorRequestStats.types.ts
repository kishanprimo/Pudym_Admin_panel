export interface CreatorRequestStats {
    total_requests: number;

    under_review: number;

    pending: number;

    approved: number;

    rejected: number;
}

export interface GetCreatorRequestStatsResponse {
    success: boolean;

    message: string;

    data: CreatorRequestStats;
}