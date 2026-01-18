import React from 'react'
import { useEffect,useState,useRef } from 'react'
import { useGetAllVideosQuery, useGetVideoByIdQuery } from '../../services/video/videoApi'
import { formateViews } from '../../utils/formateViews'
import { formateTimeAgo } from '../../utils/formateTimeAgo'
import { Link, useParams } from 'react-router-dom'
import Commentcard from '../../component/commentcard/Commentcard'
import './Player.css'
import Button from '../../component/button/Button'
import { useToggleVideoLikeMutation } from '../../services/like/likeApi'
import Postcard from '../../component/postcard/postcard'
import { useToggleSubscriptionMutation } from '../../services/subscription/subscriptionApi'
import { useGetCurrentUserQuery } from '../../services/user/userApi'
import AddPlaylist from '../../component/playlist/AddPlaylist'
import { api } from '../../services/api'


function Player() {



const {videoId} = useParams();
const {data,error,isLoading,refetch}= useGetVideoByIdQuery(videoId);

const name=useGetCurrentUserQuery().data?.data?.username;

const video = data?.data?.[0] || [];
console.log(video)

const [subscribe] = useToggleSubscriptionMutation();

const [likeVideo,{isLoading:isliking}] = useToggleVideoLikeMutation();

const handlelike = async ()=>{
    try {
       await likeVideo(videoId).unwrap();
       refetch();
        
    } catch (error) {
        alert(`Failed to toggle like! ${error?.message || ""}`);
    }
}

const handleSubscribe = async ()=>{
    
    try {
        await subscribe(video?.channel?._id).unwrap();
        refetch();
        
    } catch (error) {
       alert(`You can't subscribe your own channel ${error?.message || ""}`); 
       
    }
}

const {data:allvideo,isLoading:videoloading,error:videoerror} = useGetAllVideosQuery();

const allvideos= allvideo?.data?.docs || []


 const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


    return (
        <>

{isLoading && (
            <div style={{height:"100vh",width:"100vw",zIndex:50,display:"flex",alignItems:"center",justifyContent:"center"}}><h1>Loading...</h1></div>
) }

{!isLoading && error && (
<div style={{height:"100vh",width:"100vw",zIndex:50,display:"flex",alignItems:"center",justifyContent:"center"}}><h1>Error loading video{error}</h1></div>
)}

{!isLoading && !error && (
<div className="playercont">
    <div className="plyleft">
<div id="videoplay">
{!isLoading && !error && video &&  (

        <div className="video" style={{height:"100%",width:"100%",overflow:"hidden"}}>
  <video
        id='video'
       key={video._id}
       style={{height:"100%",width:"100%"}}
        controls
        autoPlay
        muted
        preload="auto"
        controlsList="nodownloadnoremoteplayback"
        disablePictureInPicture >
        <source src={video?.videoFile}type="video/mp4" />
        </video>
        </div>
        )}

</div>
<div id="videoinfos">
    {/* //titlee */}

    <div className="tittleandlike">
        <div id="titles">
<h2>{video.tittle}</h2>
<p>{formateViews(video.views)}&nbsp;views&nbsp;·&nbsp;{formateTimeAgo(video.createdAt)}</p>



</div>

<div id="likesave">
    <div className="likeee">

    <Button id='likebutton' text={<i class="fa-regular fa-thumbs-up"></i> } width={"2vw"} backgroundColor={"transparent"} onClick={handlelike} disabled={isliking} border={"none"} /> <span>{video?.likesCount}</span>
    </div>

<div ref={wrapperRef} className="addply">

<Button width={"70px"} text={"Save+"} backgroundColor={"black"} color={"white"} onClick={()=>setOpen(prev=> !prev)} />
    
  {open && (
 <div className="plyform">
        <AddPlaylist videoId={video?._id} />
    </div>
  )}  
   
</div>
</div>
    </div>


{/* channel */}

<div id="chnnlsub">

<div id="avatar">
    <Link to={name===video?.channel?.username? `/mychannel/${video?.channel?.username}` : `/channel/${video?.channel?.username}`}>
    <img src={video?.channel?.avatar} alt={video?.channel?.usename} />
    </Link>

<div id="chnnlname">
<p style={{fontFamily:"arial",fontSize:"1.1rem",color:"black"}}>{video?.channel?.fullName}</p>
<p>{video?.channel?.subscriberCount}&nbsp;subscriber</p>
</div>
</div>

<div id="subbtn">
    <Button id="button" backgroundColor={video.channel.isSubscribed? "whitesmoke" : "red"} text={video.channel.isSubscribed? "Subscribed" : "Subscribe"} width={"85px"} color={video.channel.isSubscribed? "red" : "white"} onClick={handleSubscribe} />
</div>

</div>

{/* describe */}

<div id="des">
    <p>{video.description}</p>
</div>
</div>

<div id="commentvideo">
<Commentcard videoId={videoId}/>

</div>
    </div>

    <div className="plyright">
        {!videoloading && !videoerror && allvideos.length>0 && (

            allvideos.map((video,idx)=>(
        <div key={video?._id || idx} className="sidevideos">
<Postcard 
_id={video?._id}
    tittle={video?.tittle}
    thumbnail={video?.thumbnail}
    duration={video?.duration}
    views={video?.views}
    updatedAt={video?.updatedAt}
    channel={video?.owner}
/>
        </div>

            ))

        )}

    </div>

</div>
)}

        </>
    )
}

export default Player
