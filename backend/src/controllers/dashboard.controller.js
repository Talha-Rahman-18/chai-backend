import mongoose from "mongoose";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from '../models/video.models.js'

import {User} from "../models/user.models.js"

const getChannelStats= asyncHandler(async(req,res)=>{
    const userId = req.user._id;



    const user = await User.aggregate([
        {
            $match:{_id:new mongoose.Types.ObjectId(userId)}
        },
        {
            $lookup:{
                from:"videos",
                localField:"_id",
                foreignField:"owner",
                as:"videoDetails"
            }
        },
        {
            $lookup:{
                from :"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscriberDetails"
            }
        },
        {
            $lookup:{
                from:"likes",
                let:{userVideos:"$videoDetails._id"},
                pipeline:[
                    {
                        $match:{
                            $expr:{$in:["$video","$$userVideos"]}
                        }
                    }
                ],
                as:"likeDetails"
            }
        },
        {
            $addFields:{
             totalViews:{
                $sum:{
                    $map:{
                        input:"$videoDetails",
                        as:"video",
                        in:{
                            $cond:{
                                if:{$isArray:"$$video.views"},
                                then:{$size:"$$video.views"},
                                else:{$ifNull:["$$video.views",0]}
                            }
                        }
                    }
                }
             },
             totalLikes:{$size:"$likeDetails"},
             totalSubscriber:{$size:"$subscriberDetails"}
            }
        },
        {
            $project:{
               username: 1,
                totalLikes: 1,
                totalSubscribers: 1,
                totalViews: 1,
                "videoDetails._id": 1,
                "videoDetails.isPublished": 1,
                "videoDetails.thumbnail": 1,
                "videoDetails.tittle": 1,
                "videoDetails.description": 1,
                "videoDetails.createdAt": 1

            }
        }
    ]);

    if(!user){
        throw new ApiError(400,"User fetched error")
    }

    return res 
    .status(200)
    .json(
        new ApiResponse(200,user,"User Fetched Successfully")
    )



})

const getChannelVideos= asyncHandler(async(req,res)=>{

const userId = req.user._id;

const video =await Video.aggregate([
    {$match:{
        owner:new mongoose.Types.ObjectId(userId)
    }},
    {
      $addFields:{
        views:{
            $cond:{
                if:{$isArray:"$views"},
                then:{$size:"$views"},
                else:{$ifNull:["$views",0]}
            }
        }
      }
    }
])

if(!video){
    throw new ApiError(404,"Fetching channels video failed")
}



return res.status(200)
.json(new ApiResponse(
    200,video,"User videos fetched successfully"
))

});

export {getChannelStats,getChannelVideos}