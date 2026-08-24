export type FeeType =
    | "subscription"
    | "post_support"
    | "live_gift_support"
    | "profile_support"
    | "campaign_support";

export type FeeStatus = "active" | "inactive";

export interface PlatformFee {
    fee_id: number;
    fee_type: FeeType;
    fee_percentage: string;
    status: FeeStatus;
    created_at: string;
    updated_at: string;
}

export interface GetPlatformFeesResponse {
    success: boolean;
    message: string;
    data: PlatformFee[];
}

export interface GetPlatformFeeByTypeResponse {
    success: boolean;
    message: string;
    data: PlatformFee;
}

export interface AddPlatformFeePayload {
    fee_type: FeeType;
    fee_percentage: number;
    status: FeeStatus;
}

export interface AddPlatformFeeResponse {
    success: boolean;
    message: string;
    data: PlatformFee;
}

export interface UpdatePlatformFeePayload {
    fee_type: FeeType;
    fee_percentage: number;
    status: FeeStatus;
}

export interface UpdatePlatformFeeResponse {
    success: boolean;
    message: string;
    data: PlatformFee;
}

export interface DeletePlatformFeeResponse {
    success: boolean;
    message: string;
}
