import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import conf from "../conf/conf";

const baseQuery = fetchBaseQuery({
  baseUrl: conf.backendUrl,
  credentials: "include",
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.originalStatus === 401) {
    const refreshResult = await baseQuery(
      {
        url: "/users/refresh-token",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // retry original query
      result = await baseQuery(args, api, extraOptions);
      localStorage.setItem('token',refreshResult?.data?.data?.accessToken);
      

    } else {
      // logout
      await baseQuery(
        { url: "/users/logout", method: "POST" },
        api,
        extraOptions
      );
      localStorage.removeItem('token')

      api.dispatch({ type: "auth/logout" }); // optional
      window.location.href = "/login";
    }
  }

  return result;
};

export default baseQueryWithReauth;
