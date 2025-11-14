import dotenv from 'dotenv'
import connectDB from "./db/index.js";
import express from "express"
import { app } from './app.js';
dotenv.config({path:'/.env'});


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is running at port: ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGO db connection failed!",err);
})

































/*

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

