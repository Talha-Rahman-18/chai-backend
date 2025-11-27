import {v2 as cloudinary} from 'cloudinary'
import dotenv from "dotenv"
dotenv.config();

import fs from "fs"
import { ApiError } from './ApiError';

    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });


const uploadOnCloudinary=async(localFilePath)=>{
try {
    if(!localFilePath) return null;
//upload the file at cloudinary

const response=await cloudinary.uploader.upload(localFilePath,{resource_type:'auto'});
 fs.unlinkSync(localFilePath);
return response;


} 
//error
catch (error) {
    fs.unlinkSync(localFilePath);//remove the file from local temp file as the uploaded opetation failed

}
}

const deleteCloudinary=async(image)=>{
   try {
        if (!image) {
            throw new ApiError(404, "Image Invalid")
        }
        //delete the file on cloudinary
        const publicId = extractPublicId(image);

        const response = await cloudinary.uploader.destroy(publicId);
        if(response.result != 'ok'){
            throw new ApiError(404, "Old Image Deletion Failed from Cloudinary")
        }

        // file has been deleted successfully
        return 1;

    } catch (error) {
        return null;
    }
}

export {uploadOnCloudinary,deleteCloudinary}