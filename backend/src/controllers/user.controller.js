import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";


//gen tokens
const generateAccessAndRefreshTokens = async (userId)=>{
try {
  const user= await User.findById(userId);
  const accessToken=user.generateAccessToken();
  const refreshToken=user.generateRefreshToken();



user.refreshToken=refreshToken;
 await user.save({validateBeforeSave: false});//it dont validate any field before save the refresh token

 return {accessToken,refreshToken}

} catch (error) {
  throw new ApiError(500,"something went wrong while generating refresh token")
}
}

//reg controller
const registerUser = asyncHandler( async (req,res)=>{
  
  //GET data from user
  const {fullName,email,username,password}=req.body
  
  //validate the date
  if([fullName,email,username,password].some((field)=> field?.trim() === "")){
   res.status(401).json("All fields are required");
    
  };
  
if(password?.trim().length < 6){
  res.status(400).json("Password must be atleast 6 characters");
}

  //check if have a prev account at the data
  const existedUser= await User.findOne({
    $or:[{ email },{ username }]
  });

  if(existedUser){

    res.status(401).json("User with this eamil or username already exist");
throw new ApiError(401,"User with this eamil or username already exist")

  }
  
  //check avatar and bcg image
  const avatarLocalPath=  req.files?.avatar[0]?.path;
  let coverImageLocalPath;

  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath=req.files.coverImage[0].path;
  }

  if(!avatarLocalPath){
    res.status(401).json("Avatar is required");
  }
  

  //upload images at cloudinary
  const avatar=await uploadOnCloudinary(avatarLocalPath);
  const coverImage=await uploadOnCloudinary(coverImageLocalPath);

  if(!avatar){
    res.status(402).json("Avatar is not uploaded");
    throw new ApiError(402,"Avatar is not uploaded");
  }

  
  //user object-create entry in db
      const user= await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
      })

  
//delete password and refresh token field from res
    const createdUser=await User.findById(user._id).select(
      "-password -refreshToken"
    );

    
//check user created?
if(!createdUser){
  res.status(502).json("something went wrong try again");
  throw new ApiError(502,"something went wrong while registering user");

}

//return res
return res.status(201).json(
  new ApiResponse(200,createdUser,"User Account Created Successfully")

)

})

//login controller//
const loginUser=asyncHandler( async (req,res)=>{
  
  
  //get data
  const {email,username,password}=req.body

  console.log(email)
  
  //check if username or email
  if(!username && !email){
    res.status(400).json("Username is required");
    throw new ApiError(400,"username or email is required")
  }
  
  //find in db
  const user= await User.findOne({
  $or:[{email},{username}]
})

if(!user){
  res.status(404).json("User with this eamil or username does not exist");
  throw new ApiError(404,"user does not exist with this username or email")
  
}

//check password
const isPasswordValid =await user.isPasswordCorrect(password);


if(!isPasswordValid){
  res.status(401).json("Password is incorrect");
  throw new ApiError(401,"password incorrect");
  
}

//access and refresh token
const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id);

const loggedInUser= await User.findById(user._id).select("-password -refreshToken");


//send cookie

const options={
  httpOnly:true,
  secure:true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000
}

return res.status(200)
.cookie("accessToken",accessToken,{
 httpOnly:true,
  secure:true,
  sameSite: "none",
  maxAge:24 * 60 * 60 * 1000
})
.cookie("refreshToken",refreshToken,options)
.json(
  new ApiResponse(200,{
    user: loggedInUser,accessToken,refreshToken
  },"User logged in successfully")
)




})

//logout//
const logoutUser=asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:undefined,
      }
    },{
      new:true,
    }
   )

   const options={
  httpOnly:true,
  secure:true,
}

return res
.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200,{},"User logged out"));
})

//refreshtoken endpoint//
const  refreshAccessToken= asyncHandler(async(req,res)=>{

  const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken

  if(!incomingRefreshToken){
    throw new ApiError(401,"unauthorized request");
  }
try {
  
  const decodedToken= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
  
  const user=await User.findById(decodedToken?._id);
  
  if(!user){
      throw new ApiError(401,"Invalid refresh token");
  
  }
  
  if(incomingRefreshToken !== user?.refreshToken){
      throw new ApiError(401,"Refresh Token is Expired or Used");
  
  }
  
  const options={
    httpOnly:true,
    secure:true,
    sameSite: "none",
    maxAge:7 * 24 * 60 * 60 * 1000
  }
  
  const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id);


  user.refreshToken = refreshToken;
  await user.save({validateBeforeSave:false})

  
  return res.status(200)
  .cookie("accessToken",accessToken,{
   httpOnly:true,
  secure:true,
  sameSite: "none",
  maxAge:3 * 60 * 60 * 1000
  })
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200,{accessToken,refreshToken},
      "Access Token Refreshed"
    )
  )
} catch (error) {
  throw new ApiError(401,"Invalid refresh token")
  
}





})

//change password//
const changeCurrentPassword= asyncHandler(async(req,res)=>{

const {oldpassword,newpassword}= req.body



const user = await User.findById(req.user?._id)
const  isPasswordCorrect = await user.isPasswordCorrect(oldpassword);

if(!isPasswordCorrect){
  res.status(400).json("Invalid password");
throw new ApiError(400,"Invalid password")
}

user.password = newpassword;

await user.save({validateBeforeSave:false})

return res.status(200).json(
  new ApiResponse(200,{},"Password changed successfully") 
)

})


//current user//
const getCurrentUser=asyncHandler(async(req,res)=>{



  return res.status(200)
  .json(
    new ApiResponse(200,req.user,"current user fetched successfully")
  )

})

//update account//

const updateAccountDetails=asyncHandler(async(req,res)=>{
const {fullName,email}=req.body

if(!fullName && !email){
  throw new ApiError(400,"All fields are required");
  res.status(400).json("All fields are required");
}

const user=await User.findByIdAndUpdate(req.user?._id,
  {
    $set:{
      fullName,email
    }
  },
  {new:true}
).select("-password -refreshToken")

return res.status(200)
.json(
  new ApiResponse(
    200,user,"Account details updated successfully"
  )
)



})

//updateUserAvatar
const updateUserAvatar=asyncHandler(async(req,res)=>{

const avatarLocalPath= req.file?.path

if(!avatarLocalPath){
  throw new ApiError(400,"Avatar file is missing")
}

const avatar= await uploadOnCloudinary(avatarLocalPath);

if(!avatar.url){
  throw new ApiError(400,"Error while uploading on avatar");

}

 const user= await  User.findByIdAndUpdate(req.user?._id,
      {
        $set:{
          avatar:avatar.url
        }
      },
      {new:true}
    ).select("-password")


    return res.status(200).json(
      new ApiResponse(200,{user},"Avatar successfully changed")
    )

})

//updateUserCoverImage
const updateUserCoverImage=asyncHandler(async(req,res)=>{

const coverImageLocalPath= req.file?.path

if(!coverImageLocalPath){
  throw new ApiError(400,"CoverImage file is missing")
}

const coverImage= await uploadOnCloudinary(coverImageLocalPath);

if(!coverImage.url){
  throw new ApiError(400,"Error while uploading on cover Image");

}

  const user = await  User.findByIdAndUpdate(req.user?._id,
      {
        $set:{
          coverImage:coverImage.url
        }
      },
      {new:true}
    ).select("-password")


    return res.status(200).json(
      new ApiResponse(200,{user},"coverImage successfully changed")
    )

})

//aggregation pipeline for get channel profile//

const getUserChannelProfile=asyncHandler(async(req,res)=>{
const {username}= req.params


if(!username?.trim()){
throw new ApiError(400,"username is missing");

}

//aggregation pipeline returns array
const channel = await User.aggregate([
  {
    $match:{
      username:username?.toLowerCase(),
    }
  },
  {
    //what we are doing here mainly in subs model we store type:Schema.Types.ObjectId,ref:"User" here mainly we stored users _id in channel and by look up we are matching them  if matched then it will publish as subscribers .
            
    $lookup:{
      from:"subscriptions",
      localField:"_id",
      foreignField:"channel",
      as:"subscribers"
    }
  },
    {
     $lookup:{
      from:"subscriptions",
      localField:"_id",
      foreignField:"subscriber",
      as:"subscribedTo"
    }
  },
  {
    $addFields:{
      subscribersCount:{
        $size:"$subscribers"
      },
      channelsSubscribedToCount:{
        $size:"$subscribedTo"
      },
      isSubscribed:{
        $cond:{
          if:{$in:[req.user?._id,"$subscribers.subscriber"]},
          then:true,
          else:false
        }
      }
    }
  },
  {
    $project:{
      username:1,
      fullName:1,
      subscribersCount:1,
      channelsSubscribedToCount:1,
      isSubscribed:1,
      avatar:1,
      coverImage:1,
      email:1,
    }
  }
  
])

if(!channel?.length){
  throw new ApiError(404,"Channel doesn't exist");
}

return res.status(200)
.json(
  new ApiResponse(200,channel[0],"user channel fetched successfully")
)

})



//watch history pipeline//
const getWatchHistory = asyncHandler(async(req,res)=>{
const user =await User.aggregate([
  {
    $match:{
      _id:new mongoose.Types.ObjectId(req.user._id)
    }
  },{
    $lookup:{
      from:"videos",
      localField:"watchHistory",
      foreignField:"_id",
      as:"watchHistory",
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
                  fullName:1,
                  avatar:1,
                  
                }
              }
            ]
            
          }
        },
        {
          $addFields:{
            owner:{
              $first:"$owner"
            }
          }
        }
      ]

    }
  }
])

//in user variable we are putting aggregation pipeline so it gives the array thats why we just take the [0] element bcz its an object then in aggregation we are matching the user id then it will find the user and work on just watchhistory part so we returning just the wh part from the whole user object .
return res
.status(200)
.json(new ApiResponse(200,user[0],"User history fetched successfully"))


})




export {registerUser,loginUser,logoutUser,refreshAccessToken,getCurrentUser,updateAccountDetails,changeCurrentPassword,updateUserAvatar,updateUserCoverImage,getUserChannelProfile,getWatchHistory}