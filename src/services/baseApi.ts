import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { env } from '@config/env';
import type { RootState } from '@app/store';

/**
 * Base API for RTK Query.
 * Each feature should `injectEndpoints` instead of creating its own api.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: env.API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Auth', 'Post'],
  endpoints: () => ({}),
});
