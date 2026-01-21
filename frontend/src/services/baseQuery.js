import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import conf from "../conf/conf";


const baseQuery = fetchBaseQuery({
  baseUrl: conf.backendUrl,
  credentials: "include",
});

 const baseQueryWithReauth = async (args, api, extraOptions) => {

  let result = await baseQuery(args, api, extraOptions);
  if (result.error?.
originalStatus === 401) {
    const refreshResult = await baseQuery(
  {
    url: "/users/refresh-token",
    method: "POST",
    credentials: "include", 
  },
  api,
  extraOptions
);


    if (refreshResult.data) {
      result = await baseQuery(args, api, extraOptions);

    } else {
      console.log("refresh failed, logging out");
      await fetch("/users/logout", { method: "POST", credentials: "include" });
      window.location.href = "/login";
    }
  }

  return result;
};


export default baseQueryWithReauth;