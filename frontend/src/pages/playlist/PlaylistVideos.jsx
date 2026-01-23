import React from 'react'
import './PlaylistVideos.css'
import PlaylistCard from '../../component/playlist/PlaylistCard'
import { useParams } from 'react-router-dom';
import { useGetPlaylistByIdQuery, useRemoveVideoFromPlaylistMutation } from '../../services/playlist/playlistApi';

import plyimg from './playlist.jpg'
import Button from '../../component/button/Button';
import PostCard from '../../component/PostCard/PostCard'
import toast from 'react-hot-toast';
import { useGetCurrentUserQuery } from '../../services/user/userApi';



function PlaylistVideos() {

    const {playlistId} = useParams();
    const {data,error,isLoading,refetch} = useGetPlaylistByIdQuery(playlistId);
    
const {data:userdata} = useGetCurrentUserQuery();
const user = userdata?.data?._id;

    const playlistinfo = data?.data || [];

    const PlaylistVideos = data?.data?.videos || [];

    const [deletefromplaylist] = useRemoveVideoFromPlaylistMutation();

    const deletevideo = async (videoId)=>{
        try {
            await deletefromplaylist({playlistId : playlistId,videoId : videoId}).
            unwrap();
            toast.success("video deleted successfully from playlist")
            refetch();


        } catch (error) {
            toast.error('Error Deleting Video');
            console.log(`Error Deleting Video,${error}`)
        }
    }


    return (
        <div className="playlistpage">

        <div className="playlistleft">


            <div className="coverphoto">
                <img src={playlistinfo?.videos?.[0]?.thumbnail || plyimg} alt={playlistinfo?.name} />
                <div className="metadataplaylist">
                    <p style={{height:"max-content",width:"50%",overflow:"auto"}}>{playlistinfo?.name}</p>
                    <p>{playlistinfo?.videos?.length}&nbsp;videos</p>
                </div>
            </div>

            <div className="ownersdata">

                <div id="playchnnlimg">
                     <img src={playlistinfo?.owner?.avatar} alt={playlistinfo?.owner?.username} />
                </div>
                     <div id="chnnldata">
                        <p>{playlistinfo?.owner?.fullName}</p>
                         <p>@{playlistinfo?.owner?.username}</p>
                     </div>

               
            </div>

        </div>


        {/* videos */}
        <div className="playlistright">

{PlaylistVideos && PlaylistVideos.length > 0? (

PlaylistVideos.map((video,idx)=>(

<div key={video?._id || idx} id="playlistvideo">

<div className="videoofply">

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

{playlistinfo?.owner?._id === user && (

<div className="buttondelete">
    <Button text={<i class="fa-solid fa-trash"></i>} height={"50px"} width={"1vw"} backgroundColor={"transparent"} onClick={()=>deletevideo(video?._id)} />
</div>
)}

                    </div>

                ))
            ):(<h2> no vidoes</h2>)}
        </div>
        </div>
    )
}

export default PlaylistVideos
