import mongoose,{isValidObjectId} from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary,deleteCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";
import {Video} from "../models/video.models.js"

const publishVideo= asyncHandler(async(req,res)=>{
const {tittle,description}=req.body;

if(!(tittle || description)){
    throw new ApiError(404,"Tittle and description is required");
}

const videoLocalpath= req.files?.videoFile[0]?.path;
if(!videoLocalpath){
    throw new ApiError(400,"Video is required");
}

const thumbnailLocalpath= req.files?.thumbnailFile[0]?.path;
if(!thumbnailLocalpath){
        throw new ApiError(400,"Thumbnail is required");
}


const videoFile= await uploadOnCloudinary(videoLocalpath);
const thumbnail= await uploadOnCloudinary(thumbnailLocalpath);

if(!(videoFile || thumbnail)){
     throw new ApiError(500,"Error file uplading");   
}

const video = await Video.create({
    videoFile:videoFile.url,
    thumbnail:thumbnail.url,
    tittle,description,
    owner:req.user._id,
    duration:videoFile.duration
})

await video.save();

return res.status(200)
.json(
    new ApiResponse(200,video,"Video published successfully")
)



})

const getAllVideos = asyncHandler(async(req,res)=>{

    const {page=1, limit=10, query="", sortBy="createdAt", sortType="desc"} = req.query;

    const pageNumber= parseInt(page);
    const limitNumber= parseInt(limit);
    const sortDirection= sortType === "asc"? 1:-1;

//regex mainly check in title that the word in query exist or not//>
    const matchStage= query?{title:{$regex:query,$options:"i"}} : {};

     const sortStage = {
        //key value pair and sortBy is "createdAt" so its createdAt=sortDirection help query in pipeline
        [sortBy]: sortDirection,
    };

   const aggregate = Video.aggregate([
    {$match:matchStage},
    {$sort:sortStage},
    {
        $lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"channel" //which channels video thats user id
        }
    },
    {
        $set:{
            channel:{$first:"$channel"}
        }
        //$unwind:"$channel" also can be used it just specify all the element of an array to object 
    },
    {
        $project:{
            _id:1,
            thumbnail:1,
            tittle:1,
            duration:1,
            isPublished:1,
            createdAt:1,
            updatedAt:1,
            "channel._id":1,
            "channel.username":1,
            "channel.avatar":1,
            views:{
                $cond:{
                    if:{$isArray:"$views"},
                    then:{$size:"$views"},
                    else:{$ifNull:[$views,0]}
                }
            }

        }
    }
   ]);

   const options={
    page:pageNumber,
    limit:limitNumber
   }

   Video.aggregatePaginate(aggregate,options,(err,result)=>{

        if(err){
            throw new ApiError(400,err.message || "Failed to fetch videos");
        }else{
            return res.status(200)
            .json(new ApiResponse(200,result,"All videos fetched successfully"));
        }

   })

   

})


const getUserVideos= asyncHandler(async(req,res)=>{
    const {page=1, limit=10, query, sortBy="createdAt", sortType="desc",userId} = req.query;

    if(!userId){
        throw new ApiError(404,"User Id missing")
    }

if(!isValidObjectId(userId)){
     throw new ApiError(400,"User Id is invalid")
}

    page = parseInt(page);
    limit = parseInt(limit);

    const userVideos= await Video.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(userId),
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner" //who is the owner of the video
            }
        },
        {
            $unwind:"$owner"
        },{
           $match:{
            ...(query && {tittle:{$regex:query,$options:"i"}}),
           } 
        },
        {
            $sort:{
                [sortBy]:sortType === "asc" ? 1 : -1,
            }
        },{
            $skip:(page - 1) *limit
        },
        {
            $limit:limit,
        },{
            $addFields:{
                views:{
                    $cond:{
                        if:{$isArray : "$views"},
                        then:{$size:"$views"},
                        else:{$ifNull:["$views",0]}
                    }
                }
            }
        },
        {
            $project:{
                "channel.email":0,
                 "channel.password":0,
                  "channel.refreshToken":0,
                   "channel.updatedAt":0,
            }
        }
    ]);

    const result = await Video.aggregatePaginate(userVideos,{page,limit});

    return res 
    .status(200)
    .json(new ApiResponse(200,result,"All users video fetched successfully"));

})

//thhis is when user click to a video and the video id goes to the url and so that here we need the like and views
const getVideoById= asyncHandler(async(req,res)=>{

const {videoId} = req.params;

if(!videoId){
    throw new ApiError(400,"No video find ,id invalid");
}

//hence we are entering video then we need to update the views and also in users watch history add the video
//promise .all is here to resolve both operation at a time dont wait for 1 to finish
await Promise.all([
    Video.findByIdAndUpdate(
        videoId,
        {$addToSet:{views:req.user._id}}
    ),
    User.findByIdAndUpdate(
        req.user._id,
        {$push:{watchHistory:videoId}}
    )
]);


const video = await Video.aggregate([
    {
        $match:{_id:new mongoose.Types.ObjectId(videoId)}
    },
    {
        $lookup:{
            from:"likes",
            localField:"_id",
            foreignField:"video",
            as:"likes"
        }
    },{
        $lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"channel"
        }
    },{
        
        $lookup:{
            from:"subscriptions",
            localField:"owner",
            foreignField:"channel",
            as:"subscribers"
        }
    },
    {$unwind:"$channel"},
    {
        $addFields:{
            likesCount:{$size:"$likes"},
            views:{
                $cond:{
                    if:{$isArray:"$views"},
                    then:{$size:"$views"},
                    else:{$ifNull:["$views",0]}
                }
            },
                "channel.subscriberCount":{$size:"$subscribers"},
                "channel.isSubscribed":{
                    $cond:{
                        if:{$in:[new mongoose.Types.ObjectId(req.user._id),"$subscribers.subscriber"]},
                        then:true,
                        else:false
                    }
                }
            
        }
    },{
        $project:{
            "channel._id":1,
            "channel.avatar":1,
            "channel.fullName":1,
            "channel.subscriberCount":1,
            "channel.username":1,
            "channel.isSubscribed":1,

            createdAt:1,
            description:1,
            duration:1,
            likesCount:1,
            tittle:1,
            videoFile:1,
            views:1,
            isPublished:1
        }
    }
]);

return res .status(200)
.json(new ApiResponse(
    200,
    video,
    "Video detailes fetched successfully"
))



})


const updateVideo= asyncHandler(async(req,res)=>{
    const {videoId} = req.params;
    if(!videoId){
        throw new ApiError(400,"Invalid video id")
    }

    const {tittle,description} = req.body;

    if(!(tittle || description)){
          throw new ApiError(400,"Tittle or description needed")      
    }

    const thumbnailLocalpath = req.file?.path;

    if(!thumbnailLocalpath){
        throw new ApiError(400,"Thumbnail required to change")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalpath);

const oldVideo=await Video.findById(videoId);
const deleteVideoonCloudinary = await deleteCloudinary(oldVideo);

if(!deleteVideoonCloudinary){
    throw new ApiError(404,"Something wrong in video deletion")
}

const video = await Video.findByIdAndUpdate(
    videoId,
    {
        $set:{
            tittle,description,thumbnail : thumbnail.url, 
        }
    },{new:true}
);



return res.
status(200)
.json(new ApiResponse(
    200,
    video,
    "Video updated successfully"
))




});

const deleteVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;
    if(!videoId){
        throw new ApiError(400,"Invalid Video Id")
    }

    const video = await Video.findByIdAndDelete(videoId);

return res.
status(200)
.json(new ApiResponse(
    200,video,
"Video deleted successfully"
))




});

const togglePublishStatus =  asyncHandler(async(req,res)=>{
    const {videoId} = req.params;
    if(!videoId){
        throw new ApiError(400,"Invalid Video Id")
    }

const video= await Video.findById(videoId);

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                isPublished:!(video.isPublished)
            }
        },
        {new:true}
    )

return res.
status(200)
.json(new ApiResponse(
    200,updatedVideo,
"Video publish status toggle successfully"
))




});



export {publishVideo,getAllVideos,getUserVideos,getVideoById,updateVideo,deleteVideo,togglePublishStatus}