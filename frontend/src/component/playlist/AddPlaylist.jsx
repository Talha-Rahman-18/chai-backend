import React, { memo, useEffect, useState } from 'react'
import './Style.css'
import { useGetCurrentUserQuery } from '../../services/user/userApi';
import { useAddVideoToPlaylistMutation, useCreatePlaylistMutation, useGetUserPlaylistsQuery } from '../../services/playlist/playlistApi';
import Input from '../input/Input';
import Button from '../button/Button';
import toast from 'react-hot-toast'


const AddPlaylist = memo((videoId)=>{

const [addPlaylist,setAddPlaylist] = useState("");
const user = useGetCurrentUserQuery();
const userId = user?.data?.data?._id;

const {data:userPlaylist,refetch} = useGetUserPlaylistsQuery(userId);
const playlists = userPlaylist?.data;


const [createPlaylist] = useCreatePlaylistMutation();

const handlePlaylist = async()=>{
    try {
        await createPlaylist({name:addPlaylist}).unwrap();
        setAddPlaylist("");
        refetch();

        toast.success("Playlist Created")
    } catch (error) {
       toast.error("Creating playlist error"); 
    }
}

const [addVideoToPlaylist] = useAddVideoToPlaylistMutation();
const [savedPlaylist,setSavedPlaylist] = useState(new Set());


useEffect(()=>{
    const preseved = new Set(
    playlists?.filter(p=>p.videos?.includes(videoId?.videoId))
        .map(p=>p._id)
    );

    setSavedPlaylist(preseved);
},[playlists,videoId]);

const handleSaveToPlaylist = async (id)=>{
    try {
        await addVideoToPlaylist({
            videoId: videoId?.videoId,
            playlistId:id,
        }).unwrap();
        toast.success("Video saved to the playlist")
    
        setSavedPlaylist((prev)=>new Set(prev).add(id));
    } catch (error) {
    toast.error("select playlist error");
    }
}


return (
    <div className="saveplaylistcont">
        <div id="savecont">
            <h4>Save To Playlist</h4>

{playlists?.length > 0?(
  playlists.map((playlist,idx)=>(
     <div key={playlist?._id || idx} className="check">
                <input type="checkbox"
                id={`Collections-checkbox-${idx}`}
                checked={savedPlaylist.has(playlist?._id)}
                onChange={()=>handleSaveToPlaylist(playlist?._id)}
                />
                <span>{playlist?.name}</span>
            </div>
  ))  
):(<p style={{textAlign:'center'}}>no playllist found</p>)}



          <Input
          value={addPlaylist}
          onChange={(e)=>setAddPlaylist(e.target.value)}
           placeholder={"Enter Playlist Name"}
            id='playlist-name' 
            label={"name"} 
            type={"text"} 
            height={"40px"} 
            width={"95%"} 
            padding={"1vw"}
            borderRadius={"8px"} />

          <Button
          children={'Create'} onClick={handlePlaylist}
          text={"Create"} height={"40px"} width={"95%"} alignSelf={"center"} backgroundColor={"red"} color={"white"} />

        </div>
    </div>
)





})

export default AddPlaylist