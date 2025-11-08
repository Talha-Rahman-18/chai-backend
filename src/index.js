import dotenv from 'dotenv'
import connectDB from "./db/index.js";

dotenv.config({path:'/.env'});


connectDB();

































/*
import express from "express"
const app=express();
//always connect database by trycatch bcz there might be issue;

(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("Error:",error);
            throw error;
        })

        app.listening(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("error in database::",error);
    }
})()
    */

