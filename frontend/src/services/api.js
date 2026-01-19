import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from '../services/baseQuery'
export const api = createApi({
    reducerPath:"api",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
   getCurrentUser:builder.query({
    query:()=>'/users/current-user'
}),
  }),
});
