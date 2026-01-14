import { memo,useState } from "react";
import {useGetVideoCommentsQuery,useAddCommentMutation,useDeleteCommentMutation} from '../../services/comment/commentApi.js'
import {formateTimeAgo} from '../../utils/formateTimeAgo.js'
import './Commentcard.css'
import Button from '../button/Button.jsx'
import Input from "../input/Input.jsx";
import toast from 'react-hot-toast'
import {useGetCurrentUserQuery} from '../../services/user/userApi.js'
import { Link } from "react-router-dom";



const Commentcard = memo(({videoId})=>{

    const token = localStorage.getItem('token');
    const user = useGetCurrentUserQuery(undefined,{skip:!token})?.data?.data;

    const name= user?.username;

    const {data:commentData,refetch,isLoading} = useGetVideoCommentsQuery(videoId);
    
    const comments =commentData?.data?.docs || [];
    


const [addingComment,setaddingComment] = useState("")
const [addComment] = useAddCommentMutation();
const [deleteComment] = useDeleteCommentMutation();

const handleAddComment = async (e) => {
  e.preventDefault(); // ✅ stops page reload

  try {
    await addComment({
      videoId,
      body: { content: addingComment }
    }).unwrap();
    setaddingComment("")

    refetch();
  } catch (error) {
    toast.error(`Failed to add comment! ${error?.message || ""}`);
  }
};


const handleDeleteComment = async(commentId)=>{
    try {
        await deleteComment(commentId).unwrap();
        toast.success("comment Deleted!");
        refetch();
        
    } catch (error) {
         toast.error(`Failed to delete comment !${error?.message || " "}`);
    }
}

return(
    <>
    {isLoading && (
        <div style={{height:"100%",width:"100%",zIndex:50,display:"flex",alignItems:"center",justifyContent:"center"}}><h1>Loading comments...</h1></div>
    )}
    
   <div className="contcomment">
    <form id="inputs"  onSubmit={handleAddComment}>
    <div className="inputs">
    <h4 style={{margin:"0",padding:"0",alignSelf:"flex-start"}}>{comments?.length}&nbsp;comments</h4>
    <Input
    id="input"
    value={addingComment}
    placeholder={"comments"}
    padding={"1%"}  
    onChange={(e)=>setaddingComment(e.target.value)}
    />
    <Button 
    text={"Comment"}
    height={"50px"}
    width={"150px"}
    backgroundColor={"red"}
    display={"flex"}
    alignItems={"center"}
    justifyContent={"center"}
    alignSelf={"center"}
    />
   </div>
   </form>

{comments && comments && comments.length>0?(
    comments.map((comment,idx)=>(
       <div key={comment._id || idx} className="cmmntcontent">
        <div className="img">
            <Link to={name===comment?.commentor?.username? `/mychannel/${comment?.commentor?.username}` : `/channel/${comment?.commentor?.username}`}>
        <img className="cmmnt" src={comment?.commentor?.avatar} alt="" />
        </Link>
        </div>
        <div className="content">
            <h4>{comment?.commentor?.fullName} &nbsp;.&nbsp;{formateTimeAgo(comment.createdAt)}</h4> <span>@{comment?.commentor?.username}</span>
           
            <p>{comment.content}</p>
            </div>
        <Button backgroundColor={"red"}
        color={"white"}
        text={<i class="fa-solid fa-trash"></i>}
        onClick={(e)=>{
            e.preventDefault();
            handleDeleteComment(comment._id)
        }}></Button>
    </div>
    ))
):(<p style={{alignSelf:"center",marginTop:"20px"}}>No comments on this video</p>)}
    
    </div> 
     
    </>
)
})

export default Commentcard