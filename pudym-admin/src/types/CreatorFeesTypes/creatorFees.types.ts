import type { FeeType, FeeStatus } from "@/types/FeesTypes/fees.types";

export type { FeeType, FeeStatus };

export interface CreatorFeeUser {
    email: string;
    user_id: number;
    name: string;
}

export interface CreatorFee {
    creator_fee_id: number;
    creator_id: number;
    fee_type: FeeType;
    fee_percentage: string;
    status: FeeStatus;
    created_at: string;
    updated_at: string;
    User: CreatorFeeUser;
}

export interface GetCreatorFeesResponse {
    success: boolean;
    message: string;
    data: CreatorFee[];
}

export interface AddCreatorFeePayload {
    creator_id: number;
    fee_type: FeeType;
    fee_percentage: number;
}

export interface AddCreatorFeeResponse {
    success: boolean;
    message: string;
    data: CreatorFee;
}

export interface UpdateCreatorFeePayload {
    creator_id: number;
    fee_type: FeeType;
    fee_percentage: number;
}

export interface UpdateCreatorFeeResponse {
    success: boolean;
    message: string;
    data: CreatorFee;
}
