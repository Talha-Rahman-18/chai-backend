import React from 'react'
import { useEffect } from 'react';
import './History.css'
import { useGetCurrentUserQuery, useGetWatchHistoryQuery } from '../../services/user/userApi'
import { formateTimeAgo } from '../../utils/formateTimeAgo';
import { formateViews } from '../../utils/formateViews';
import PostCard from '../../component/PostCard/PostCard'
import Loading from '../../component/loading/Loading'

function History() {

const {data,error,isLoading,refetch} = useGetWatchHistoryQuery()
const videos = data?.data?.
watchHistory || [];

 useEffect(() => {
        refetch();
    }, [videos, refetch]);


    return (
        <div id='history'>

<div className="heading">
 <h2 style={{position:"relative",height:"max-content",width:"100%",margin:"0",padding:"0"}}>Here is Your Watch History:</h2>
</div>
   

   <div className="mainhistory">

{isLoading && (
    <Loading />
)}


{error && (
    <div style={{height:"100vh",width:"100vw",textAlign:"center"}} className="error">
        <h2>Error Fetching WatchHistory, Please Login</h2>
    </div>
)}
          

{!error && !isLoading && videos.length > 0? (

    videos.map((video,idx)=>(
 <div key={video?._id || idx} className="historyvideo">
<PostCard
    _id={video?._id}
    tittle={video?.tittle}
    thumbnail={video?.thumbnail}
    duration={video?.duration}
    views={video?.views?.length}
    createdAt
={video?.createdAt}
    channel={video?.owner}
/>
 </div>
    ))

):(<h2 style={{height:"100%",width:"100%",textAlign:"center"}}>no videos</h2>)}

</div>
</div>
           
    )
}

export default History
