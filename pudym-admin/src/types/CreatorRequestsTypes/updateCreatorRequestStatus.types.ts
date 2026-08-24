import type { CreatorRequestStatus } from "./getCreatorRequests.types";

export type { CreatorRequestStatus };

export interface UpdateCreatorRequestStatusResponse {
    success: boolean;
    message: string;

    data: {
        user_id: number;
        status: CreatorRequestStatus;
        admin_text: string;
        role: string;
        profile_verification_status: boolean;
    };
}