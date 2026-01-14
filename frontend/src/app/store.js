
import { configureStore } from "@reduxjs/toolkit";
import {videoApi} from '../services/video/videoApi.js'
import {playlistApi} from '../services/playlist/playlistApi.js'
import {commentApi} from '../services/comment/commentApi.js'
import {likeApi} from '../services/like/likeApi.js'
import {dashboardApi} from '../services/dashboard/dashboardApi.js'
import {userApi} from '../services/user/userApi.js'
import {subscriptionApi} from '../services/subscription/subscriptionApi.js'
import {tweetApi} from '../services/tweet/tweetApi.js'
import { api } from "../services/api.js";

const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [videoApi.reducerPath]: videoApi.reducer,
        [playlistApi.reducerPath]: playlistApi.reducer,
        [commentApi.reducerPath]: commentApi.reducer,
        [likeApi.reducerPath]: likeApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [subscriptionApi.reducerPath]: subscriptionApi.reducer,
        [tweetApi.reducerPath]: tweetApi.reducer,
        [api.reducerPath]:api.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            userApi.middleware,
            videoApi.middleware,
            playlistApi.middleware,
            commentApi.middleware,
            likeApi.middleware,
            dashboardApi.middleware,
            subscriptionApi.middleware,
            tweetApi.middleware,
            api.middleware
        ),
});

export default store;
