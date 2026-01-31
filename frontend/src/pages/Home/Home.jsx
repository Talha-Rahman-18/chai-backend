import React, { useState,useEffect } from 'react'
import VideoCard from '../../component/video/VideoCard'
import './Home.css'
import { api, useGetcurrentuserQuery } from '../../services/api'
import { useGetAllVideosQuery, useGetAllVideosSearchQuery } from '../../services/video/videoApi'
import PostCard from '../../component/PostCard/PostCard'
import Loading from '../../component/loading/Loading'

function Home() {

    const [search,setsearch] = useState("");

const {data:videos,isLoading,error} = useGetAllVideosSearchQuery({
    page:1,
    query:search,
});

const video = videos?.data?.docs || [] ;
console.log(video)

const {
  data,
  isLoading:userloading,
  isFetching,
  error:usererror
} = useGetcurrentuserQuery(undefined, {
  refetchOnMountOrArgChange: true,
});


// const channel= data?.data || [];

    return (

     <div id='home'>
        {isLoading && (
          <Loading />
        )}

<div className="search">

    <input placeholder={"Search Videos"} type="text" value={search} onChange={(e)=>setsearch(e.target.value)} />

    <span id='icon'><i class="fa-solid fa-magnifying-glass"></i></span>

</div>
<div className="videosall">

{!isLoading && !error && video.length > 0? (

    video.map((vdo,idx)=>(

        <div key={vdo?._id || idx} className="specificvideo">

 {vdo?.isPublished && (

    <div className="vdo">

<PostCard 
    _id={vdo?._id}
    tittle={vdo?.tittle}
    thumbnail={vdo?.thumbnail}
    duration={vdo?.duration}
    views={vdo?.views}
    createdAt={vdo?.createdAt}
    channel={vdo.owner}
    />

    </div>

 )}
</div>

    ))
    
    
):(<h1>No videos</h1>)}


</div>

     </div>   
    )
}

export default Home
