import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


export const verifyJWT= asyncHandler(async(req,_,next)=>{

    try {
        //if accesstoken saved to client then it gives the cookie but if not then user will sent a header where the token goes as authorization bearer token name but we just need the token name so we replace the barer part to a empty string and we get only the token name;
       const token= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    
    
       if(!token){
        throw new ApiError(401,"Unauthorized request");
       }
    
       //it varify the secret providing with the secret used at genereting and return a object of user info used to create token...so we can access user from it.
     const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    
     const user= await User.findById(decodedToken?._id).select("-password -refreshToken")
    
    
     if(!user){
        throw new ApiError(401,"Invalid access token");
     }
    
     //if access token checked that this is the user then push the user info in user req body;
     req.user=user;
    
     //go for next work
    next();

    } catch (error) {
        throw new ApiError(401,error?.message || "invalid access token");
    }

})