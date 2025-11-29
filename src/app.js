import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true

}))

app.use(express.json({limit:"16kb",extended:true}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"))

app.use(cookieParser());

//routes import
import userRouter from './routes/user.routes.js';
import videoRouter from './routes/video.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'

//routes declare
app.use("/api/v2/users",userRouter);
app.use("/api/v2/users",dashboardRouter);
app.use("/api/v2/users",videoRouter);



export {app}