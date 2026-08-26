import type {
    CreatorStatus,
} from "./getCreators.types";

export interface CreatorDetails {
    user_id: number;

    profile_pic: string | null;

    full_name: string | null;

    first_name: string | null;

    last_name: string | null;

    user_name: string | null;

    email: string | null;

    mobile_num: string | null;

    country_code: string | null;

    gender: string | null;

    dob: string | null;

    country: string | null;

    state: string | null;

    city: string | null;

    id_proof: string | null;

    selfie: string | null;

    name: string | null;

    cpf: string | null;

    address: string | null;

    payment_type: string | null;

    pix_key: string | null;

    cnpj: string | null;

    company_name: string | null;

    company_address: string | null;

    purpose_description: string | null;

    role: string | null;

    admin_approve: string;

    admin_text: string | null;

    profile_verification_status: boolean;

    is_deactivated: boolean;
    admin_deactivation_reason: string | null;

    blocked_by_admin: boolean;

    admin_block_reason: string | null;
    available_coins: string | number;

    total_socials: number;

    createdAt: string;

    updatedAt: string;

    status: CreatorStatus | "approved";
}

export interface GetCreatorDetailsResponse {
    success: boolean;

    message: string;

    data: CreatorDetails;
}