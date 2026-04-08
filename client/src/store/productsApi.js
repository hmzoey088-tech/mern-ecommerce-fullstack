import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/products' }),
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    fetchProducts: builder.query({
      query: ({ page = 1, search = '', filters = {} }) => {
        const params = new URLSearchParams({ page, search, ...filters }).toString();
        return `?${params}`;
      },
      providesTags: ['Products'],
    }),
    fetchProductBySlug: builder.query({
      query: (slug) => `/${slug}`,
    }),
  }),
});

export const { useFetchProductsQuery, useFetchProductBySlugQuery } = productsApi;
