import {v2 as cloudinary} from 'cloudinary'

import fs from "fs"

    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.envCLOUDINARY_API_SECRET 
    });


const uploadOnCloudinary=async(localFilePath)=>{
try {
    if(!localFilePath) return null;
//upload the file at cloudinary

const response=await cloudinary.uploader.upload(localFilePath,{resource_type:'auto'});

//file has been uploaded successfully
console.log("file uploaded on cloudinary",response.url);
return response;


} 
//error
catch (error) {
    fs.unlinkSync(localFilePath);//remove the file from local temp file as the uploaded opetation failed

}
}


export {uploadOnCloudinary}