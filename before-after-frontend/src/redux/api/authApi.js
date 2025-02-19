import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [tagTypes.user, tagTypes.auth],
    }),

    signIn: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [tagTypes.user, tagTypes.auth],
    }),

    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/otp/verify-otp",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [tagTypes.otp],
    }),

    resendOtp: builder.mutation({
      query: (data) => ({
        url: "/otp/resend-otp",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [tagTypes.otp],
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "PATCH",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),

      invalidatesTags: [tagTypes.auth],
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: [tagTypes.auth],
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body: data,
      }),

      providesTags: [tagTypes.auth, tagTypes.user],
    }),
  }),

  overrideExisting: true,
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
