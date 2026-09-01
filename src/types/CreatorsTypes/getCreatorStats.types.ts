export interface CreatorStats {
    total_creators: number;

    active_creators: number;

    deactivated_creators: number;
}

export interface GetCreatorStatsResponse {
    success: boolean;

    message: string;

    data: CreatorStats;
}