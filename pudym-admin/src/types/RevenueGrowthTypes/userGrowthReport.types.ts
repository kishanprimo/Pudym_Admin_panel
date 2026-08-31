export interface UserGrowthDateRange {
    start_date: string;
    end_date: string;
}

export interface UserGrowthSummary {
    total_new_users: number;
}

export interface UserGrowthChartItem {
    date: string;
    new_users: number;
}

export interface UserGrowthUser {
    user_id: number;
    full_name: string;
    user_name: string;
    email: string;
    role: string;
    created_at: string;
}

export interface UserGrowthReportData {
    period: string;

    date_range: UserGrowthDateRange;

    summary: UserGrowthSummary;

    chart: UserGrowthChartItem[];

    data: UserGrowthUser[];
}

export interface UserGrowthReportResponse {
    success: boolean;
    message: string;
    data: UserGrowthReportData;
}