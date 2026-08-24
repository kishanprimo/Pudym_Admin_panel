import type { CreatorRequestStatus } from "./getCreatorRequests.types";

export interface CreatorRequestDetails {
    user_id: number;

    user_name: string | null;

    email: string | null;

    mobile_num: string | null;

    profile_pic: string | null;

    id_proof: string | null;

    selfie: string | null;

    dob: string | null;

    full_name: string | null;

    first_name: string | null;

    last_name: string | null;

    country_code: string | null;

    gender: string | null;

    country: string | null;

    state: string | null;

    city: string | null;

    name: string | null;

    cpf: string | null;

    address: string | null;

    payment_type: string | null;

    pix_key: string | null;

    cnpj: string | null;

    company_name: string | null;

    company_address: string | null;

    purpose_description: string | null;

    admin_approve: string;

    admin_text: string | null;

    role: string | null;

    profile_verification_status: boolean;

    is_deactivated: boolean;

    createdAt: string;

    updatedAt: string;

    status: CreatorRequestStatus;
}

export interface GetCreatorRequestDetailsResponse {
    success: boolean;

    message: string;

    data: CreatorRequestDetails;
}