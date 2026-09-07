export interface SettingsConfig {
    app_logo_light: string;
    app_logo_dark: string;
    splash_image: string;

    one_signal_api_key: string;
    android_channel_id: string;

    web_logo_light: string;
    web_logo_dark: string;

    twilio_account_sid: string;
    twilio_auth_token: string;

    msg_91_auth_key: string;
    msg_91_private_key: string;
    msg_91_template_id: string;

    twilio_phone_number: string;
    password: string;

    email_banner: string;

    config_id: number;

    phone_authentication: boolean;
    email_authentication: boolean;

    maximum_members_in_group: number;

    show_all_contatcts: boolean;
    show_phone_contatcs: boolean;

    one_signal_app_id: string;

    app_name: string;
    app_email: string;
    app_text: string;

    app_primary_color: string;
    app_secondary_color: string;

    app_ios_link: string;
    app_android_link: string;
    app_tell_a_friend_text: string;

    email_service: string;
    smtp_host: string;
    email: string;
    email_port: string;
    email_title: string;

    purchase_code: string;

    copyright_text: string;

    privacy_policy: string;
    terms_and_conditions: string;
    delete_account: string;

    s3_region: string;
    s3_access_key_id: string;
    s3_secret_access_key: string;
    s3_bucket_name: string;

    mediaflow: string;

    stripe: boolean;
    stripe_public_key: string;
    stripe_secret_key: string;

    gpay: boolean;
    gpay_merch_id: string;
    gpay_merch_name: string;
    gpay_country_code: string;
    gpay_currency_code: string;

    apple_pay: boolean;
    apple_pay_merch_id: string;
    apple_pay_merch_name: string;
    apple_pay_country_code: string;
    apple_pay_currency_code: string;

    paypal: boolean;
    paypal_public_key: string;
    paypal_secret_key: string;

    google_login_authentication: boolean;
    apple_login_authentication: boolean;

    is_extended: boolean;
    is_demo: boolean;
    isRechargeEnable: boolean;

    referral_coin: number;

    createdAt: string;
    updatedAt: string;
}

export interface GetSettingsResponse {
    status: boolean;
    data: SettingsConfig;
    message: string;
    toast: boolean;
}

export interface UpdateSettingsResponse {
    status: boolean;
    data: SettingsConfig;
    message: string;
    toast: boolean;
}