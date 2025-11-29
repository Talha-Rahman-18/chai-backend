import mongoose,{isValidObjectId} from "mongoose";
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {User} from '../models/user.models.js'
import {Subscription} from '../models/subscription.models.js'


const toggleSubscription = asyncHandler(async(req,res)=>{

const {channelId} = req.params;

if(!isValidObjectId(channelId)){
    throw new ApiError(404,"Invalid channel Id");
}

const isSubscribed = await Subscription.findOne({channel:channelId,subscriber:req.user._id});

if(req.user._id === channelId){
    throw new ApiError(400,"You can't subscribe your own cahnnel")
}

if(!isSubscribed){
    const channel = await Subscription.create({
        subscriber:req.user._id,
        Channel:channelId,
    })

    return res
    .status(200)
    .json(new ApiResponse(200,channel,"Sbscribed Channel"))
}else{

const channel = await Subscription.deleteOne();//though there must be a single document for  single user then it will delete it.

  return res
    .status(200)
    .json(new ApiResponse(200,channel,"Unsbscribed Channel"))


}











})

const getUserChannelSubscribers = asyncHandler(async(req,res)=>{

    const {channelId} = req.params;

    if(!isValidObjectId(channelId)){
        throw new ApiError(404,"Inavlid channelId")
    }

    const subscribers = await Subscription.aggregate([
        {$match:{
            channel:new mongoose.Types.ObjectId(channelId)
        }},
        {
            $lookup:{
                from :"users",
                localField:"subscriber",
                foreignField:"_id",
                as:"allSubscribers"
            }
        },{
            $unwind:"$allSubscribers"
        },
        {
            $project:{
                _id:0,
                username:"allSubscribers.username",
                avatar:"$allSubscribers.avatar"
            }
        }
    ]);


if(!subscribers){
    throw new ApiError(400,"Fetching subscriber failed")
}

return res
    .status(200)
    .json(
        ApiResponse(200, subscribers, "Channel Subscribers fetched successfully")
    )

})

const getSubscribedToDetails = asyncHandler(async(req,res)=>{
    const {subscriberId} = req.params;

    if(!subscriberId){
        throw new ApiError(404,"Invalid id")
    }


const channels = await Subscription.aggregate([
    {$match:{
        subscriber:new mongoose.Types.ObjectId(subscriberId)
    }},
    {
        $lookup:{
            from:"users",
            localField:"channel",
            foreignField:"_id",
            as:"channels"
        }
    },{
        $lookup:{
            from:"users",
            localField:"subscriber",
            foreignField:"_id",
            as:"subscriberDetails"
        }
    },
    {
        $addFields:{
            subscriberCount:{$size:"$subscriberDetails"}
        }
    },
    {$unwind:"$channels"},
    {
        $project:{
            _id:1,
            username:"$channels.username",
            fullName:"$channels.fullName",
            avatar:"$channels.avatar",
            subscriberCount:1
        }
    }
])


if(!channels){
    throw new ApiError(400,"Fetching channel failed")
}

return res
    .status(200)
    .json(
        new ApiResponse(200, channels, "User Subscribed Channels fetched successfully")
    )



})



export {toggleSubscription,getUserChannelSubscribers,getSubscribedToDetails}