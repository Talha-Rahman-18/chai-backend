import React from 'react'
import VideoCard from '../../component/video/VideoCard'
import { useGetCurrentUserQuery } from '../../services/user/userApi'
import './Home.css'
function Home() {

const {data} = useGetCurrentUserQuery();
const channel= data?.data || [];

    return (
     <div id='home'>
        <VideoCard data={channel?._id} userSpecificVideos={false}  />
     </div>   
    )
}

export default Home
