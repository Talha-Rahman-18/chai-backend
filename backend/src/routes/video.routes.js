import { publishVideo,getAllVideos,getUserVideos,getVideoById,updateVideo,deleteVideo,togglePublishStatus } from "../controllers/video.controller.js";

 import { upload } from "../middlewares/multer.middleware.js";

 import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

 const router = Router();

 router.route("/videos")
 .get(getAllVideos)
 .post(
    upload.fields([
        {
            name:"videoFile",
            maxCount:1
        },{
            name:"thumbnail",
            maxCount:1
        }
    ]),
    verifyJWT,
    publishVideo
 )

router.use(verifyJWT);


router.route("/user/videos").get(getUserVideos)

router.route("/:videoId").get(getVideoById)

 router.route("/:videoId").delete(deleteVideo).patch(upload.single("thumbnail"),updateVideo)

 router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

 export default router