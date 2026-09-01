export interface CreatorSubscriptionDateRange {
    start_date: string;
    end_date: string;
}

export interface CreatorSubscription {
    subscription_id: number;

    creator_id: number;
    creator_name: string;

    subscriber_id: number;
    subscriber_name: string;

    plan_id: number;
    plan_name: string;

    amount: number;

    payment_status: string;

    status: string;

    created_at: string;
}

export interface CreatorSubscriptionReportData {
    period: string;

    date_range: CreatorSubscriptionDateRange;

    data: CreatorSubscription[];
}

export interface CreatorSubscriptionReportResponse {
    success: boolean;
    message: string;
    data: CreatorSubscriptionReportData;
}