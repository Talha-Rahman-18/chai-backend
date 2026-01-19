import {fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import conf from '../conf/conf.js'

export const baseApi = fetchBaseQuery({
    baseUrl:import.meta.env.VITE_BACKEND_URL,
    credentials:"include",
    prepareHeaders:(headers,{endpoint})=>{

        const token = localStorage.getItem('token');

        const noAuthEndpoints = ['registerUser','loginUser','refreshAccessToken','getAllVideos'];

        if(!noAuthEndpoints.includes(endpoint) && token){
            headers.set('Authorization',`Bearer ${token}`);
        }

        return headers;

    }
})

