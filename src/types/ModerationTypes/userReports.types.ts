export interface UserReportUser {
    user_name: string;
    email: string;
    profile_pic: string;
    user_id: number;
    full_name: string;
    first_name: string;
    last_name: string;
    role: string;
    is_deactivated: boolean;
    is_deleted: boolean;
    blocked_by_admin: boolean;
}

export interface UserReportType {
    report_type_id: number;
    report_text: string;
    report_for: string;
}

export interface UserReport {
    report_id: number;
    report_by: number;
    report_type: number;
    report_text: string;
    report_to: number;
    createdAt: string;
    updatedAt: string;
    report_type_id: number;

    reporter: UserReportUser;
    reported: UserReportUser;
    Report_type: UserReportType;
}

export interface UserReportsPagination {
    total_pages: number;
    total_records: number;
    current_page: number;
    records_per_page: number;
}

export interface UserReportStats {
    total_reports: number;
    active_users: number;
    deactivated_users: number;
}

export interface UserReportsResponse {
    success: boolean;
    message: string;
    data: {
        Records: UserReport[];
        Pagination: UserReportsPagination;
    };
}

export interface UserReportDetailsResponse {
    success: boolean;
    message: string;
    data: UserReport;
}

export interface UserReportStatsResponse {
    success: boolean;
    message: string;
    data: UserReportStats;
}

export interface UpdateUserStatusResponse {
    success: boolean;
    message: string;
    data: {
        user_id: number;
        is_deactivated: boolean;
        role: string;
    };
}

export interface DeleteUserReportResponse {
    success: boolean;
    message: string;
    data: {
        report_id: number;
        deleted: boolean;
    };
}