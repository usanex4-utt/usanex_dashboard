import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/app/store";
import { logout } from "@/features/auth/authSlice";
import type { AdminUser } from "@/features/auth/authSlice";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    api.dispatch(logout());
  }
  return result;
};

// ---------- Types ----------

export interface AuthResponse {
  token: string;
  token_type: string;
  expires_at: string;
  admin: AdminUser;
}

export interface MessageResponse {
  detail: string;
}

export interface OtpMessageResponse {
  detail: string;
  otp?: string | null;
}

export interface SessionInfo {
  id: number;
  created_at: string;
  last_used_at: string | null;
  expires_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

export interface RegisterRequest {
  full_name: string;
  mobile_number: string;
  password: string;
  confirm_password: string;
}

export interface VerifyOtpRequest {
  mobile_number: string;
  otp: string;
}

export interface LoginRequest {
  mobile_number: string;
  password: string;
}

export interface ForgotPasswordRequest {
  mobile_number: string;
}

export interface ResetPasswordRequest {
  mobile_number: string;
  otp: string;
  new_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface LogoutRequest {
  revoke_all: boolean;
}

// ---------- API ----------

export const adminAuthApi = createApi({
  reducerPath: "adminAuthApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Admin", "Sessions"],
  endpoints: (builder) => ({
    register: builder.mutation<OtpMessageResponse, RegisterRequest>({
      query: (body) => ({
        url: "/api/admin/auth/register",
        method: "POST",
        body,
      }),
    }),
    verifyOtp: builder.mutation<AuthResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: "/api/admin/auth/verify-otp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),
    resendOtp: builder.mutation<OtpMessageResponse, { mobile_number: string }>({
      query: (body) => ({
        url: "/api/admin/auth/resend-otp",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/api/admin/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Admin", "Sessions"],
    }),
    me: builder.query<AdminUser, void>({
      query: () => "/api/admin/auth/me",
      providesTags: ["Admin"],
    }),
    sessions: builder.query<SessionInfo[], void>({
      query: () => "/api/admin/auth/sessions",
      providesTags: ["Sessions"],
    }),
    logout: builder.mutation<MessageResponse, LogoutRequest>({
      query: (body) => ({
        url: "/api/admin/auth/logout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Admin", "Sessions"],
    }),
    changePassword: builder.mutation<MessageResponse, ChangePasswordRequest>({
      query: (body) => ({
        url: "/api/admin/auth/change-password",
        method: "POST",
        body,
      }),
    }),
    forgotPassword: builder.mutation<OtpMessageResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/api/admin/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<MessageResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: "/api/admin/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useLoginMutation,
  useMeQuery,
  useSessionsQuery,
  useLogoutMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = adminAuthApi;