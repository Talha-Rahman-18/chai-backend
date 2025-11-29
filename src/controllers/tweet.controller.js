import mongoose from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import {User} from '../models/user.models.js'
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async(req,res)=>{
    const {content} = req.body;
    const {userId} = req.user._id;


    if(!content){
        throw new ApiError(400,"Content is required")
    }

const tweet = await Tweet.create({
    content,
    owner:userId
})

if(!tweet){
     throw new ApiError(404,"tweet creation failed")
}

return res.status(200)
.json(new ApiResponse(
    200,
    tweet,
    "Tweet Created Scuccessfully"
))


})

const getUserTweets = asyncHandler(async(req,res)=>{

    const {userId} = req.params;
    if(!userId){
        throw new ApiError(404,"Invalid user id")
    }

    const userTweets = await User.aggregate([
        {$match:{
            _id:new mongoose.Types.ObjectId(userId)
        }},
        {
            $lookup:{
                from :"tweets",
                localField:"_id",
                foreignField:"owner",
                as:"tweets"
            }
        },
        {$unwind:"$tweets"},
        {
            $lookup: {
                from: "likes",
                let: { tweetId: "$tweets._id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$tweet", "$$tweetId"] } } },
                    { $count: "count" }
                ],
                as: "likesCount"
            }
        },
        {
            $addFields:{
                "tweets.likesCount":{
                    $ifNull:[{$arrayElemAt:["$likesCount",0]},0]
                }
            }
        },
        {
            $group:{
                _id:"$_id",
                fullName:{$first:"$fullName"},
                username:{$first:"$username"},
                email:{$first:"$email"},
                avatar:{$first:"$avatar"},
                tweets:{$push:"$tweets"}
                
            }
        },
        {
            $project:{
                fullName:1,
                username:1,
                email:1,
                avatar:1,
                tweets:1
            }
        }
    ]);


     return res
        .status(200)
        .json(
            new ApiResponse(200, userTweets, "Getting User Tweets Successful")
        )

})

 const updateTweet = asyncHandler(async(req,res)=>{
        const {tweetId} = req.params;
        const {newContent} = req.body;

         if (!newContent) {
        throw new ApiError(400, "Invalid Content")
    }

    const tweet = await Tweet.findByIdAndUpdate(tweetId,
        {
            $set: {
                content: newContent
            }
        },
        {
            new: true
        }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, tweet, "Updated Tweet Successfully")
        )
 })

const deleteTweet = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params;

    const tweet=await Tweet.findByIdAndDelete(tweetId);

    return res
    .status(200)
    .json(new ApiResponse(200,tweet,"Tweet deleted successfully"))
})



export {createTweet,getUserTweets,updateTweet,deleteTweet}