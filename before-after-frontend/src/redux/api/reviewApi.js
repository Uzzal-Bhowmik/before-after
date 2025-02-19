import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServiceProviderReviews: builder.query({
      query: () => "/reviews",
      providesTags: [tagTypes.reviews],
      transformResponse: (res) => res?.data,
    }),

    createReview: builder.mutation({
      query: (data) => ({
        url: "/reviews",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [tagTypes.reviews],
    }),

    // updateReview: builder.mutation({
    //   query: (data) => ({
    //     url: `/review/update/${data?.reviewId}`,
    //     method: "PATCH",
    //     body: data?.reviewData,
    //   }),

    //   invalidatesTags: [tagTypes.review, tagTypes.product, tagTypes.products],
    // }),

    // deleteReview: builder.mutation({
    //   query: (reviewId) => ({
    //     url: `/review/${reviewId}`,
    //     method: "DELETE",
    //   }),

    //   invalidatesTags: [tagTypes.review, tagTypes.product, tagTypes.products],
    // }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetServiceProviderReviews,
  // useUpdateReviewMutation,
  // useDeleteReviewMutation,
} = reviewApi;
