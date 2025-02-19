import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const pricingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPackages: builder.query({
      query: (query) => ({ url: "/packages", method: "GET", params: query }),
      providesTags: [tagTypes.packages],
      transformResponse: (res) => res?.data,
    }),
  }),
});

export const { useGetAllPackagesQuery } = pricingApi;
