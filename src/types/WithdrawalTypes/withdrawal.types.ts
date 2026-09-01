export interface WithdrawalUser {
    user_name: string;
    email: string;
    user_id: number;
    first_name: string;
    last_name: string;
}

export interface Withdrawal {
    transaction_id: number;
    user_id: number;
    payment_method: string;
    acutal_money: number;
    available_money: string;
    coin: string;
    success: string;
    transaction_type: string;
    coin_price: string;
    past_coin: string;
    new_available_coin: string;
    currency: string;
    tax: number;
    admin_margin: number;
    transaction_id_gateway: string;
    transaction_email: string;
    createdAt: string;
    updatedAt: string;
    User: WithdrawalUser;
}

export interface GetWithdrawalsResponse {
    success: boolean;
    message: string;
    data: Withdrawal[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    };
}

export interface GetWithdrawalDetailsResponse {
    success: boolean;
    message: string;
    data: Withdrawal;
}

export interface WithdrawalActionResponse {
    success: boolean;
    message: string;
}
