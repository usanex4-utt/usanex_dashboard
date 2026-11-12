import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/app/store";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getOverview: builder.query<any, void>({
      query: () => "/api/admin/dashboard/overview",
    }),
    getUsersGraph: builder.query<any, void>({
      query: () => "/api/admin/dashboard/users",
    }),
    getContent: builder.query<any, void>({
      query: () => "/api/admin/dashboard/content",
    }),
    getHealth: builder.query<any, void>({
      query: () => "/api/admin/dashboard/health",
    }),
    getActivity: builder.query<any, void>({
      query: () => "/api/admin/dashboard/activity",
    }),
  }),
});

export const {
  useGetOverviewQuery,
  useGetUsersGraphQuery,
  useGetContentQuery,
  useGetHealthQuery,
  useGetActivityQuery,
} = dashboardApi;