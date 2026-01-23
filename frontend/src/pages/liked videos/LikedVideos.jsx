import React from 'react'
import { useEffect } from 'react';
import './LikedVideos.css'
import { useGetCurrentUserQuery, useGetWatchHistoryQuery } from '../../services/user/userApi'
import { formateTimeAgo } from '../../utils/formateTimeAgo';
import { formateViews } from '../../utils/formateViews';
import { useGetLikedVideosQuery } from '../../services/like/likeApi';
import PostCard from '../../component/PostCard/PostCard'
import Loading from '../../component/loading/Loading'

function LikedVideos() {

const {data,error,isLoading,refetch} = useGetLikedVideosQuery()
const videos = data?.data || [];


 useEffect(() => {
        refetch();
    }, [videos, refetch]);



    return (
        <div id='likedvideo'>

<div className="heading">


<h2 style={{position:"relative",height:"max-content",width:"100%",margin:"0",padding:"0"}}>Here is Your Liked Videos:</h2>

</div>
   

   <div className="likedmain">

{isLoading && (
    <div style={{height:"100%",width:"100%",textAlign:"center"}} className="error">
        <Loading />
    </div>
)}


{error && (
    <div style={{height:"100vh",width:"100vw",textAlign:"center"}} className="error">
        <h2>Error Fetching Liked Videos,Please Login</h2>
    </div>
)}
          

{!isLoading && !error && videos.length > 0? (

    videos.map((video,idx)=>(
 <div key={video?._id || idx} className="likedvideoss">
<PostCard 
    _id={video?.videoDetails
?._id}
    tittle={video?.videoDetails
?.tittle}
    thumbnail={video?.videoDetails
?.thumbnail}
    duration={video?.videoDetails
?.duration}
    views={video?.videoDetails
?.views?.length}
    createdAt
={video?.videoDetails
?.createdAt}
    channel={video?.channel[0]}
/>

 </div>
    ))

):(<h2 style={{height:"50vh",width:"80vw",textAlign:"center"}}>No videos</h2>)}

</div>
</div>
           
    )
}

export default LikedVideos
