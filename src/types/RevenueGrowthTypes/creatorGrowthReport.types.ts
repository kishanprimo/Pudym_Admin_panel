export interface CreatorGrowthDateRange {
    start_date: string;
    end_date: string;
}

export interface CreatorGrowthSummary {
    total_new_creators: number;
}

export interface CreatorGrowthChartItem {
    date: string;
    new_creators: number;
}

export interface CreatorGrowthCreator {
    user_id: number;
    full_name: string;
    user_name: string;
    email: string;
    role: string;
    created_at: string;
}

export interface CreatorGrowthReportData {
    period: string;

    date_range: CreatorGrowthDateRange;

    summary: CreatorGrowthSummary;

    chart: CreatorGrowthChartItem[];

    data: CreatorGrowthCreator[];
}

export interface CreatorGrowthReportResponse {
    success: boolean;
    message: string;
    data: CreatorGrowthReportData;
}