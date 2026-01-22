import { memo,useRef,useState } from "react";
import './VideoCard.css'
import { Link } from "react-router-dom";
import {useGetAllUserVideosQuery,useGetAllVideosQuery,usePublishAVideoMutation} from '../../services/video/videoApi'
import Button from "../button/Button";
import PostCard from "../PostCard/PostCard";







const VideoCard=memo(({data,userSpecificVideos=true,addVideoBtn=false})=>{

    const boxref = useRef(null);


    const [form,setform] = useState({
        tittle:"",
        description:"",
        videoFile:null,
        thumbnail:null,
    });
    const [isOpen,setisOpen] = useState(false);

    const {data:allvideos,error:allerror,isLoading:allloading} = useGetAllVideosQuery({
      page:1,
      query:""
    });

    const {data:userVideos,error:userError,isLoading:userLoading} = useGetAllUserVideosQuery({userId:data},{skip:!data});

    const [publishAVideo,{isLoading:publishLoading}] = usePublishAVideoMutation();
    
    const videosData = userSpecificVideos? userVideos : allvideos;
    const videos = videosData?.data?.docs || [];
    const isLoading = userSpecificVideos? userLoading : allloading;
    const error = userSpecificVideos? userError:allerror;



const handleChange=(e)=>{
     const { name, value, files } = e.target;
    if (files) {
      setform((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setform((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
}

const handleSubmit = async (e)=>{
e.preventDefault();
const formdata = new FormData();
for(let key in form){
    if(form[key]){
        formdata.append(key,form[key]);
    }
}

    try {
        const res = await publishAVideo(formdata).unwrap();
        // console.log("video",res)
        alert("video uploaded successfully!!")
        setisOpen(false);
        form.tittle=""
        form.description=""
        form.thumbnail=null
        form.videoFile=null
        
    } catch (error) {
        console.log(`video upload failed:${error.message || error}`);
    
        alert(`video upload failed:${error.message || error}`);
    }
}

const handleClick =()=>{
    setisOpen(true);

    setTimeout(() => {
      boxref.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
}




    return(
<>
<div className="videocard">
{addVideoBtn && (
    <div className="advideobtn">
        <Button 
        height={"50px"}
        width={"150px"}
        backgroundColor={"red"}
        color={"white"}
        text={"Video +"}
        onClick={handleClick}
        />
    </div>
)}

<div className="allvideo">
{!isLoading && !error && videos.length>0? (
 videos.map((video,idx)=>(
    


    <div key={video._id || idx} className="videos">
    {video?.
isPublished && (
  <div className="video"> 
<PostCard 
    _id={video?._id}
    tittle={video?.tittle}
    thumbnail={video?.thumbnail}
    duration={video?.duration}
    views={video?.views}
    createdAt={video?.createdAt}
    channel={video.owner}
    />
  </div>      
    ) }

        
    </div>
    
))
) :(<h1>no video</h1>)}
</div>

{isOpen && (
    <form className="formvideo"  onSubmit={handleSubmit}>

    <div ref={boxref} className="videofullcont" onClick={(e)=>setisOpen(false)}>

   <div className="addvideo" onClick={(e)=>e.stopPropagation()}>

   <div className="cancle">
    <Button backgroundColor={"white"} color={"black"} text={<i class="fa-solid fa-xmark"></i>} width={"50px"} 
    onClick={()=>setisOpen(false)}
    />

   </div>
    

    <div className="videofile">
        <h3>Upload your video here and complete all the information below</h3>

      <h1>⬆️</h1>

        <label id="labelvideo" htmlFor="videoFile">
            <input
            type="file"
            id="videoFile"
            name="videoFile"
            accept="video/*"
            onChange={handleChange}
            
            />
            select video
        </label>

    </div>

    <div className="inputvideo">
        <input id="thumbnail" 
        type="file"
        placeholder="Choose thumbnail"
        name="thumbnail"
        accept="image/*"
        onChange={handleChange}
        
        />
        <input id="titlevideo" 
        type="text" 
        placeholder="Tittle"
        name="tittle"
        value={form.tittle}
        onChange={handleChange}
        />

        <textarea name="description" placeholder="Description"
        value={form.description }
        onChange={handleChange} 
        id="descriptionvideo" 
        style={{resize:"none"}}></textarea>
    </div>

 <div className="sbmtbtns">
    <Button color={publishLoading? "white":"black"} backgroundColor={publishLoading? "transparent" : "white"} text={publishLoading? "Saving..." : "save"} type="submit"  />
    </div>
</div>

</div>
</form>
)}

</div>
</>

    )

})

export default VideoCard;

