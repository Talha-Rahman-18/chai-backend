import { toggleSubscription,getUserChannelSubscribers,getSubscribedToDetails } from "../controllers/subscription.controller.js";

import {verifyJWT} from '../middlewares/auth.middleware.js'
import { Router } from "express";

const router = Router();
router.use(verifyJWT);

router.route("/c/:channelId").get(getUserChannelSubscribers).post(toggleSubscription);

router.route("/u/:subscribedId").get(getSubscribedToDetails)

export default router;