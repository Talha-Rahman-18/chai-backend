import React, { useState } from 'react'
import './Dashboard.css'
import { useGetChannelStatsQuery } from '../../services/dashboard/dashboardApi'
import { useGetCurrentUserQuery } from '../../services/user/userApi';
import { useGetUserChannelSubscribersQuery } from '../../services/subscription/subscriptionApi';
import { useDeleteVideoMutation, usePublishAVideoMutation, useTogglePublishStatusMutation, useUpdateVideoMutation } from '../../services/video/videoApi';
import { formateTimeAgo } from '../../utils/formateTimeAgo';
import Button from '../../component/button/Button';



function Dashboard() {

    const [isopen,setisopen] = useState(false);

    const [form,setform] = useState({
        thumbnail:null,
        tittle:"",
        description:""
    })


const {data,refetch,isLoading} = useGetChannelStatsQuery();

const user = data?.data || [];
const videos = user?.videoDetails || [];
console.log(videos)



const [toggle,{isLoading:toggleLoading}]  = useTogglePublishStatusMutation();

const [deleteVideo] = useDeleteVideoMutation();

const [updateVideo] = useUpdateVideoMutation();


const handeditform=(video)=>{
setform({
    tittle:video.tittle,
    description:video.description
});
setisopen(true);
}

const handleEdit = async()=>{

const formdata = new FormData(id);
formdata.append("tittle",form.tittle);
formdata.append("description",form.description);

if(form.thumbnail){
    formdata.append("thumbnail",form.thumbnail);
}

  try {
    await updateVideo({
        videoId:id,
        formData:formdata
    }).unwrap();

    refetch();

    alert("video update succesfully");
  } catch (error) {

    alert("video updation failed",error);
  }  
}




const handledelete = async (id)=>{
try {
 
    await deleteVideo(id).unwrap();
    alert("Video Deleted Successfully")
    refetch();

} catch (error) {
    alert("video delete failed")
    console.log("video dlete error",error)

}
}

const togglePublish = async (video)=>{
try {
 
    await toggle(video?._id).unwrap();
    refetch();

} catch (error) {
    alert("Failed to toggle publish video")
    console.log(`Failed to toggle publish video,${error?.message || error}`)

}
}





    return (

        <div className="dashboard">


{isopen && (
<div className="editvideo">
    
</div>
)}



           <div className="dashtext">
            <h1>Admin Panel</h1>
            <h2>Welcome, {user?.username}</h2>
            <p>Seamless Video Management, Elevated Results.</p>
           </div>

           <div id="dashinfos">
            <div className="box">
                <h1>😎</h1>
                <p>Total Views</p>
                <h2>{user?.totalViews}</h2>
            </div>
            <div className="box">
                <h1>😎</h1>
                <p>Total Likes</p>
                <h2>{user?.totalLikes}</h2>
            </div>
            <div className="box">
                <h1>😎</h1>
                <p>Total Subscribers</p>
                <h2>{user?.
totalSubscriber}</h2>
            </div>
           </div>


<div className="dashboardwork">
    <h3>Toggle</h3>
    <h3>Status</h3>
    <h3>Uploaded</h3>
    <h3>Uploaded At</h3>
    <h3>Operations</h3>
</div>

{user?.videoDetails?.length > 0 && (
    user.videoDetails.map((video,idx)=>(
<div className="videostatus">
    <input type="checkbox"
    checked={!!video?.isPublished}
    onChange={()=>togglePublish(video)}
    disabled={toggleLoading}
    />

<p>{video?.isPublished? "Published":"Unpublished"}</p>

<div className="imgg">
    <img style={{height:"50px",width:"50px",borderRadius:"50%",border:"2px solid black"}} src={video?.thumbnail
} alt="avatar" /> <h4>{video?.tittle}</h4>
</div>

<p>{formateTimeAgo(video?.createdAt)}</p>

<div className="operations">
    <Button text={"de"} backgroundColor={"red"} color={"white"} onClick={()=>handledelete(video?._id)} />
    <Button text={"ed"} backgroundColor={"green"} color={"white"} onClick={()=>handeditform(video)} />
</div>



</div>

    ))
)}



        </div>
    )
}

export default Dashboard
