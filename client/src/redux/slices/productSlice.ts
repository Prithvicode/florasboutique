import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// API slice for product-related endpoints
const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5001/api/" }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products", // The URL to fetch products from
    }),

    getProductById: builder.query({
      query: (id) => `/products/${id}`,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productApi;
export default productApi;
