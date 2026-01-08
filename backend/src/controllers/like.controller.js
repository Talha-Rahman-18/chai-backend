import mongoose,{isValidObjectId} from "mongoose";
import {Like} from '../models/like.models.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {Video} from '../models/video.models.js'


const toggleVideoLike = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;


    if(!isValidObjectId(videoId)){
        throw new ApiError(404,"Invalid Video Id");
    }

    const isLiked = await Like.findOne({
        video:videoId,
        likedBy:req.user._id
    });

    if(!isLiked){
        const like = await Like.create({
            //check if the user like the video or not
            video:videoId,
            likedBy:req.user._id,
        });

        return res
        .status(200)
        .json(new ApiResponse(200,like,"Liked the video"))
    }else{
        const unlike=await isLiked.deleteOne();
        return res
        .status(200)
        .json(new ApiResponse(200,unlike,"Unliked the video"))
    
    }


})

const toggleCommentLike =  asyncHandler(async(req,res)=>{
    const {commentId} = req.params;
    const {userId} = req.user._id;


    if(!isValidObjectId(commentId)){
        throw new ApiError(404,"Invalid comment Id");
    }

    const isLiked = await Like.findOne({
        comment:commentId,
        likedBy:userId
    })

    if(!isLiked){
        const like = await Like.create({
            //check if the user like the video or not
            comment:commentId,
            likedBy:userId
        });

        return res
        .status(200)
        .json(new ApiResponse(200,like,"Liked the comment"))
    }else{
        const like=await Like.deleteOne(isLiked._id);
        return res
        .status(200)
        .json(new ApiResponse(200,like,"Unliked the comment"))
    
    }


})

const toggleTweetLike =  asyncHandler(async(req,res)=>{
    const {tweetId} = req.params;
    const {userId} = req.user._id;


    if(!isValidObjectId(tweetId)){
        throw new ApiError(404,"Invalid tweet Id");
    }

    const isLiked = await Like.findOne({
        tweet:tweetId,
        likedBy:userId
    })

    if(!isLiked){
        const like = await Like.create({
            //check if the user like the video or not
            tweet:tweetId,
            likedBy:userId
        });

        return res
        .status(200)
        .json(new ApiResponse(200,like,"Liked the tweet"))
    }else{
        const like=await Like.deleteOne(isLiked._id);
        return res
        .status(200)
        .json(new ApiResponse(200,like,"Unliked the tweet"))
    
    }


})

const getLikedVideos = asyncHandler(async(req,res)=>{
    const {userId} = req.user._id;

    const likedVideos = await Like.aggregate([
        {$match:{
            likedBy:new mongoose.Types.ObjectId(req.user._id),
            video:{
                $exists:true,
            }
        }
    },
        {
                $lookup:{
                    from:"videos",
                    localField:"video",
                    foreignField:"_id",
                    as:"videoDetails"
                }
        },
        {
            $lookup:{
                from:"users",
                localField:"likedBy",
                foreignField:"_id",
                as:"channel"
            }
        },{$unwind:"$videoDetails"},
        {
            $project:{
                _id:0,
                likedAt:"$createdAt",
                videoDetails:1,
                channel:{
                    username:{$getField:{field:"username",input:{$arrayElemAt:["$channel",0]}}},

                    avatar:{$getField:{field:"avatar",input:{$arrayElemAt:["$channel",0]}}}

                }
            }
        }
    ]);

    if(!likedVideos){
        throw new ApiError(400,"Liked Videos Fetch failed")
    }

return res
.status(200)
.json(new ApiResponse(200,likedVideos,"All Liked Videos"))


})




export {toggleVideoLike,toggleCommentLike,toggleTweetLike,getLikedVideos}