import React from 'react'
import { useEffect } from 'react';
import './History.css'
import { useGetCurrentUserQuery, useGetWatchHistoryQuery } from '../../services/user/userApi'
import Postcard from '../../component/postcard/postcard';
import { formateTimeAgo } from '../../utils/formateTimeAgo';
import { formateViews } from '../../utils/formateViews';




function History() {

const {data,isError,isLoading,refetch} = useGetWatchHistoryQuery()
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
    <div style={{height:"100%",width:"100%",textAlign:"center"}} className="error">
        <h1>Loading WatchHistory...</h1>
    </div>
)}


{isError && (
    <div style={{height:"100%",width:"100%",textAlign:"center"}} className="error">
        <h1>Error Fetching WatchHistory</h1>
    </div>
)}
          

{!isError && !isLoading && videos.length > 0? (

    videos.map((video,idx)=>(
 <div key={video?._id || idx} className="historyvideo">
<Postcard 
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

):(<h1 style={{height:"100%",width:"100%",textAlign:"center"}}>no videos</h1>)}

</div>
</div>
           
    )
}

export default History
