import {Link} from 'react-router-dom'
import './PlaylistCard.css'
import plyimg from './playlist.jpg'
import { useDeletePlaylistMutation,useGetUserPlaylistsQuery,useUpdatePlaylistMutation } from '../../services/playlist/playlistApi'
import { useState } from 'react'
import { Form } from 'react-hook-form'
import toast from 'react-hot-toast'
import {confirmDelete} from '../../utils/confirmDelete'
import { formateTimeAgo } from '../../utils/formateTimeAgo'
import Button from '../button/Button'
import Input from '../input/Input'


function PlaylistCard ({data, editAndDelete=true}){
    const [form, setForm] = useState({
        name: "",
        description: ""
    });

const {data:playlistsData,refetch} = useGetUserPlaylistsQuery(data,{skip:!data});


const playlists = playlistsData?.data || [];

const [isOpen,setisOpen] = useState(true);
const [selectPlaylist,setselectPlaylist] = useState(null);

const [deletePlaylist] = useDeletePlaylistMutation();
const [updatePlaylist] = useUpdatePlaylistMutation();

const handleDelete = async(playlistId)=>{
    try {

        await deletePlaylist(playlistId);
        refetch();
        
    } catch (error) {
        alert("Failed to delete playlist");
        console.log("Failed to delete playlist");
    }
}

 const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

const handleOpenEdit = (playlist)=>{
    setselectPlaylist(playlist);

   setForm({
    name:playlist?.name,
    description:playlist?.description || ""
   });

   setisOpen(true);
};

const handleEdit = async()=>{
    if(!selectPlaylist?._id) return;

    try {
        await updatePlaylist({playlistId:selectPlaylist?._id,body:form}).unwrap();
        toast.success("Playlist updated successfully");

        setisOpen(false);
        setselectPlaylist(null);
        refetch();


      
    } catch (error) {
    toast.error(`Failed to update the playlist! ${error?.message || ""}`);       
    }
}

return (
    <>
    <div className="playlistcont">
    {playlists && playlists.length >0 ?  ( 

        playlists.map((playlist,idx)=>(

        <Link key={playlist?._id || idx} to={`/playlist/${playlist?._id}`}>

       <div className="playlist" key={playlist?._id || idx}>

       <div className="imgplaylist">

        <img id='playlistimage' src={playlist?.videos[0]?.thumbnail  || plyimg} alt={playlist?.name} />
 
        <div className="infoplaylist">
            <div className="playlistname">
                <p>{playlist?.name}</p>
                <p>{formateTimeAgo(playlist?.createdAt)}</p>
            </div>
            <div id="videocount">
                <p>{playlist?.videos.length}&nbsp;video</p>
            </div>
        </div>

        <div className="edits">

            <Button text={<i class="fa-solid fa-pen-to-square"></i>} width={"50%"}
             backgroundColor={"green"}
            color={"white"}
            onClick={(e)=>{
                e.preventDefault();
                handleOpenEdit(playlist);
            }}
            />
           
            <Button text={<i class="fa-solid fa-trash"></i>} width={"50%"}
            backgroundColor={"red"}
            color={"white"}
            onClick={(e)=>{
                e.preventDefault();
                handleDelete(playlist._id);
            }}
            />
            
        </div>

        </div>

       </div>

         </Link>
      
    ) )):(<div style={{height:"100%",width:"100vw",textAlign:"center"}}><h1>No playlist created </h1></div>)}
 </div>
  

   
{isOpen && selectPlaylist &&(
    <form onSubmit={(e) => {
        e.preventDefault();
        handleEdit();
    }}>

    <div className="editform" onClick={()=>setisOpen(false)}>
    <div className="editmain" onClick={(e)=>e.stopPropagation()}>
        <div className="headedit">
            <h3>Edti Playlist</h3>
            <div className="editbtns">
                <Button text={"×"} width={"30px"} height={"40px"}
                onClick={(e)=>{e.preventDefault();
                    setisOpen(false);
                }}
                />
            <Button text={"save"} width={"2vw"} height={"40px"}
             type='submit'
            />
            </div>
            
        </div>

       <div className="editsinfo">
        <label htmlFor="name">Username</label>
        <input
        label={"Name"}
        type="text"
        name='name'
         placeholder='name'
         onChange={handleChange}
         value={form.name}
         />

        <label htmlFor="desc">Description</label>
        <textarea 
        id='desc'
        name='description'
        value={form.description}
        onChange={handleChange}
        placeholder='description' 
        style={{height:"55%" ,
        width:"90%",
        paddingTop:"1%",
        backgroundColor:"transparent",
        color:"white",
        fontSize:"1.2rem",
        border:"2px solid white",
        resize:"none"}}></textarea>
       </div>
    </div>
</div>
</form>


)}

    </>
)





}
export default PlaylistCard;