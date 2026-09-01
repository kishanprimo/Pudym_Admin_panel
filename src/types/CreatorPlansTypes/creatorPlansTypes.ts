export interface CreatorPlanFeature {
    plan_feature_id: number;
    plan_id: number;
    feature_name: string;
    feature_value: string;
    feature_type: "boolean" | "number" | "text" | string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreatorPlanCreator {
    user_name: string;
    email: string;
    profile_pic: string;
    user_id: number;
    full_name: string;
    first_name: string;
    last_name: string;
    is_deactivated: boolean;
    blocked_by_admin: boolean;
    status: string;
}

export interface CreatorPlan {
    plan_id: number;
    creator_id: number;
    name: string;
    slug: string;
    price: string;
    duration_days: number;
    description: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;

    creator: CreatorPlanCreator;

    features: CreatorPlanFeature[];
}

export interface CreatorPlansPagination {
    total_pages: number;
    total_records: number;
    current_page: number;
    records_per_page: number;
}

export interface CreatorPlansResponse {
    success: boolean;
    message: string;

    data: {
        Records: CreatorPlan[];
        Pagination: CreatorPlansPagination;
    };
}