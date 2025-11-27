import mongoose from "mongoose";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Comment } from "../models/comment.models.js";
import {Video} from "../models/video.models.js"

const getVideoComments = asyncHandler (async(req,res)=>{

    const {videoId} = req.params;

    const {page= 1, limit = 10} = req.query;
    const option = {
        page,limit
    }

    if(!videoId){
        throw new ApiError(400,"Vidoe id Invalid")
    }

    const videoComments= await Comment.aggregate([
        {$match:{
            video:new mongoose.Types.ObjectId(videoId)
        }},
        {
            $lookup:{
                from :"users",
                localField:"owner",
                foreignField:"_id",
                as:"commentor"
            }
        },{$unwind:"$commentor"},
        {
            $project:{
                _id:1,
                content:1,
                createdAt:1,
                "commentor.username":1,
                "commentor.fullName":1,
                 "commentor.avatar":1

            }
        }
    ]);

    if(!videoComments){
        throw new ApiError(400, "Failed comment fetching.")       
    }



Comment.aggregatePaginate(videoComments,option,function(err,res){
    if(err){
        throw new ApiError(400,"Invalid comment fetching in aggregation")
    }else{
        return res.status(200)
        .json(new ApiResponse(200,res,"Got all video comments successfully"))
    }
})

})

const addComment = asyncHandler(async(req,res)=>{

const {videoId} = req.params.videoId;
const {content} = req.body;
const {userId} =req.user._id

if(!content){
    throw new ApiError(400,"Content unabailable")
}

if(!videoId){
     throw new ApiError(404,"Video unabailable")
}

const comment = await Comment.create(
    {
        content,
        video:videoId,
        owner:userId
    }
)

await comment.save();

return res
.status(200).json(new ApiResponse(200,comment,"comment created fully"))





})

const updateComment = asyncHandler(async(req,res)=>{

const {commentId} = req.params;
const {newContent} = req.body;

if(!newContent){
     throw new ApiError(404,"content unabailable")
}

if(!commentId){
     throw new ApiError(400,"Invalid Comment Id")
}

const updatedComment = await Comment.findByIdAndUpdate(
    commentId,{
        $set:{
            content:newContent
        }
    },{new:true}
)



  return res
        .status(200)
        .json(
            new ApiResponse(200, updatedComment, "Comment updated successfully")
        )

})

const deleteComment = asyncHandler(async(req,res)=>{

const {commentId} = req.params;

if(!commentId){
     throw new ApiError(400,"Invalid Comment Id")
}

const deletedComment = await Comment.findByIdAndDelete(
    commentId
)



  return res
        .status(200)
        .json(
            new ApiResponse(200, deleteComment, "Comment deleted successfully")
        )

})


export {getVideoComments,addComment,updateComment,deleteComment}