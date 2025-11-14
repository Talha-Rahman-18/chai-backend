import e from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"


const registerUser = asyncHandler( async (req,res)=>{
  
  //GET data from user
  const {fullname,email,username,password}=req.body
  
  //validate the date
  if([fullname,email,username,password].some((field)=> field?.trim() === "")){
    throw new ApiError(400,"All fields are required");
    
  };
  
  //check if have a prev account at the data
  const existedUser= User.findOne({
    $or:[{ email },{ username }]
  });
  if(existedUser){throw new ApiError(409,"User with this eamil or username already exist")}
  
  //check avatar and bcg image
  const avatarLocalPath=  req.files?.avatar[0]?.path;
  const coverImageLocalPath=req.files?.coverImage[0]?.path;
  
  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar is required");
  }
  
  //upload images at cloudinary
  const avatar=await uploadOnCloudinary(avatarLocalPath);
  const coverImage=await uploadOnCloudinary(coverImageLocalPath);
  
  if(!avatar){
    throw new ApiError(400,"Avatar is required");
  }
  
  //user object-create entry in db
      const user= await User.create({
        fullname,
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
  throw new ApiError(500,"something went wrong while registering user");
}

  //return res
return res.status(201).json(
  new ApiResponse(200,createdUser,"User Account Created Successfully")
)




})

export {registerUser}