import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

// const BASE = "/users";

const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Transformation Posts APIs
    getTransformationPosts: builder.query({
      query: (query) => ({
        url: "/transformation-posts",
        method: "GET",
        params: query,
      }),
      providesTags: [tagTypes.transformationPosts],

      transformResponse: (res) => ({
        data: res?.data?.data,
        meta: res?.data?.meta,
      }),
    }),

    getTransformationPostById: builder.query({
      query: (id) => `/transformation-posts/${id}`,
      providesTags: [tagTypes.transformationPosts],
      transformResponse: (res) => res?.data,
    }),

    getMyTransformationPosts: builder.query({
      query: () => "/transformation-posts/my-post",
      providesTags: [tagTypes.myTransformationPosts],

      transformResponse: (res) => res?.data,
    }),

    createTransformationPost: builder.mutation({
      query: (data) => ({
        url: "/transformation-posts",
        method: "POST",
        body: data,
      }),
    }),

    editTransformationPost: builder.mutation({
      query: (data) => ({
        url: `/transformation-posts/${data.id}`,
        method: "PATCH",
        body: data.data,
      }),
      invalidatesTags: [
        tagTypes.transformationPosts,
        tagTypes.myTransformationPosts,
      ],
    }),

    deleteTransformationPost: builder.mutation({
      query: (id) => ({
        url: `/transformation-posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        tagTypes.transformationPosts,
        tagTypes.myTransformationPosts,
      ],
    }),

    // Service Posts APIs
    getMyServicePosts: builder.query({
      query: (query) => ({
        url: "/service-posts/my-service-post",
        method: "GET",
        params: query,
      }),
      providesTags: [tagTypes.servicePosts],
      transformResponse: (res) => res?.data,
    }),

    getSingleServicePost: builder.query({
      query: (id) => `/service-posts/${id}`,
      providesTags: [tagTypes.servicePost],
      transformResponse: (res) => res?.data,
    }),

    createServicePost: builder.mutation({
      query: (data) => ({
        url: "/service-posts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.servicePosts],
    }),

    editServicePost: builder.mutation({
      query: (data) => ({
        url: `/service-posts/${data.id}`,
        method: "PATCH",
        body: data.data,
      }),
      invalidatesTags: [tagTypes.servicePosts, tagTypes.servicePost],
    }),

    deleteServicePost: builder.mutation({
      query: (id) => ({
        url: `/service-posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.servicePosts],
    }),

    completeServicePost: builder.mutation({
      query: (servicePostId) => ({
        url: `/service-posts/completed/${servicePostId}`,
        method: "PATCH",
      }),

      invalidatesTags: [tagTypes.servicePosts, tagTypes.servicePost],
    }),

    /**
     *  Request from service providers for customer's service post
     */
    getRequestsForPost: builder.query({
      query: (query) => ({
        url: `/requests`,
        method: "GET",
        params: query,
      }),
      transformResponse: (res) => res?.data,
      providesTags: [tagTypes.requestsForPost],
    }),

    getSingleRequest: builder.query({
      query: (id) => `/requests/${id}`,
      providesTags: [tagTypes.request],
      transformResponse: (res) => res?.data,
    }),

    acceptServiceProviderRequest: builder.mutation({
      query: (requestId) => ({
        url: `/requests/approved/${requestId}`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.requestsForPost],
    }),

    declineServiceProviderRequest: builder.mutation({
      query: (requestId) => ({
        url: `/requests/canceled/${requestId}`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.requestsForPost],
    }),
  }),

  overrideExisting: true,
});

export const {
  // Transformation apis
  useGetTransformationPostsQuery,
  useGetTransformationPostByIdQuery,
  useGetMyTransformationPostsQuery,
  useCreateTransformationPostMutation,
  useEditTransformationPostMutation,
  useDeleteTransformationPostMutation,

  // Service post apis
  useGetMyServicePostsQuery,
  useGetSingleServicePostQuery,
  useCreateServicePostMutation,
  useEditServicePostMutation,
  useDeleteServicePostMutation,
  useCompleteServicePostMutation,

  //  Request apis
  useGetRequestsForPostQuery,
  useGetSingleRequestQuery,
  useAcceptServiceProviderRequestMutation,
  useDeclineServiceProviderRequestMutation,
} = customerApi;
