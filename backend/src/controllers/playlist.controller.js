import mongoose,{isValidObjectId} from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async(req,res)=>{
const {name,description} = req.body;

if(!name){
    throw new ApiError(400,"Name is requeired for playlist")
}

const playlist = await Playlist.create({
    name,
    description:description || " ",
    owner:req.user._id,

})

if(!playlist){
   throw new ApiError(404,"playlist creation failed") 
}

return res.status(200)
.json(new ApiResponse(
    200,playlist,"playlist created successfully"
))

});

const getUserPlaylist = asyncHandler(async(req,res)=>{
const {userId} = req.params;


if(!isValidObjectId(userId)){
    throw new ApiError(400,"User Id not found");
}

const userPlaylist = await Playlist.find({owner:userId})
.populate({
    path:"videos",
    select:"thumbnail"
});

if(!userPlaylist){
    throw new ApiError(400,"No playlist found")
}

return res.status(200)
.json(new ApiResponse(200,userPlaylist,"User playlists fetched"))


});

const getPlaylistById = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params;

    if(!playlistId){
        throw new ApiError(404,"Playlist Id not found")
    }


const playlist = await Playlist.aggregate([
    {$match:{
        _id:new mongoose.Types.ObjectId(playlistId)
    }},
    {
        $lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"owner",
            pipeline:[
                {
                    $project:{
                        username:1,
                        fullName:1,
                        avatar:1
                    }
                }
            ]
        }
    },
    {
        $lookup:{
            from:"videos",
            localField:"videos",
            foreignField:"_id",
            as:"videos",
            pipeline:[
                {
                    $lookup:{
                        from:"users",
                        localField:"owner",
                        foreignField:"_id",
                        as:"owner",
                        pipeline:[
                            {
                                $project:{
                                    username:1,
                                    avatar:1
                                }
                            }
                        ]
                    }
                },
                {$unwind:"$owner"},
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
                },
                {
                    $project:{
                        _id:1,
                        tittle:1,
                        thumbnail:1,
                        duration:1,
                        views:1,
                        owner:1,
                        createdAt:1
                    }
                }

            ]
        }
    },
    {$unwind:"$owner"}
]);

if(!playlist || playlist.length === 0){
    throw new ApiError(400,"Playlist not found")
}


return res
.status(200)
.json(new ApiResponse(200,playlist[0],"Playlist fetched by id"))

});

const addVideoToPlaylist = asyncHandler(async(req,res)=>{

    const {videoId,playlistId} = req.params;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalidvideo id")
    }


if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist Id")
    }

const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
        $addToSet:{
            videos:videoId
        }
    },
    {new:true}
)

if(!playlist){
    throw new ApiError(400,"Add Video Failed")
}

return res
.status(200)
.json(new ApiResponse(
    200,playlist,"Video Added to The Playlist"
))

});

const removeVideoFromPlaylist = asyncHandler(async(req,res)=>{

    const {playlistId,videoId} = req.params;
    console.log(playlistId,videoId)

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist Id")
    }
    if(!isValidObjectId(videoId)){
    throw new ApiError(400,"Invalid video Id")    
    }

const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
        $pull:{
            videos:videoId
        }
    },
    {new:true}
)

if(!playlist){
    throw new ApiError(400,"Removing Video Failed")
}

return res
.status(200)
.json(new ApiResponse(
    200,playlist,"Video Removed from The Playlist"
))

});

const deletePlaylist = asyncHandler(async(req,res)=>{

    const {playlistId} = req.params;

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist Id")
    }

const playlist = await Playlist.findByIdAndDelete(playlistId);

if(!playlist){
    throw new ApiError(400,"Remove Playlist Failed")
}

return res
.status(200)
.json(new ApiResponse(
    200,playlist,"Playlist Deleted Successfully"
))

});

const updatePlaylist = asyncHandler(async(req,res)=>{
    const {name,description} = req.body;
    const {playlistId} = req.params;

    if(!isValidObjectId(playlistId)){
        throw new ApiError(404,"Invalid playlist id")
    }

if(!name || !description){
    throw new ApiError(400,"Name or Description required")   
}

const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
        $set:{
            name,description
        }
    },
    {
        new:true
    }
)

if(!playlist){
    throw new ApiError(400,"Updating playlist failed")
}


return res
.status(200)
.json(new ApiResponse(
    200,playlist,"Update Playlist Successfully"
))
});





export {createPlaylist,getUserPlaylist,getPlaylistById,addVideoToPlaylist,removeVideoFromPlaylist,deletePlaylist,updatePlaylist}