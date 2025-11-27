import { Router } from "express";
 import { getChannelStates,getChannelVideos } from "../controllers/dashboard.controller";
 import {verifyJWT} from "../middlewares/auth.middleware.js"

 const router = Router();

 router.use(verifyJWT);

 router.route("/states").get(getChannelStates)
 router.route("/videos").get(getChannelVideos)

 export default router;