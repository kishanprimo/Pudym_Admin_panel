export interface UserDetails {
  user_id: number;
  profile_pic: string | null;

  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  user_name: string | null;

  email: string | null;
  mobile_num: string | null;
  country_code: string | null;

  login_type: string | null;
  role: string | null;

  country: string | null;
  state: string | null;
  city: string | null;

  gender: string | null;
  dob: string | null;
  bio: string | null;

  is_private: boolean;
  profile_verification_status: string | null;
  login_verification_status: string | null;

  platforms: unknown;

  available_coins: number | null;
  total_socials: number | null;

  blocked_by_admin: boolean;
  is_deactivated: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface GetUserDetailsResponse {
  success: boolean;
  message: string;
  data: UserDetails;
}