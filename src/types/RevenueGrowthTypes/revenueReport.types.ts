export interface RevenueDateRange {
    start_date: string;
    end_date: string;
}

export interface RevenueSummary {
    total_revenue: number;
    total_user_recharge_revenue: number;
    total_transactions: number;
}
export interface RevenueChartItem {
    date: string;
    revenue: number;
}

export interface RevenueUser {
    user_id: number;
    full_name: string;
    user_name: string;
    email: string;
    role: string;
    total_revenue: number;
    transaction_count: number;
}



export interface RevenueTransaction {
    transaction_id: number;
    user_id: number;
    user_name: string;
    full_name: string;
    email: string;
    role: string;
    amount: number;
    currency: string;
    transaction_type: string;
    payment_method: string;
    success: string;
    created_at: string;
}

export interface RevenueReportData {
    period: string;

    date_range: RevenueDateRange;

    summary: RevenueSummary;

    chart: RevenueChartItem[];

    users: {
        total: number;
        data: RevenueUser[];
    };

    transactions: RevenueTransaction[];

   
}

export interface RevenueReportResponse {
    success: boolean;
    message: string;
    data: RevenueReportData;
}