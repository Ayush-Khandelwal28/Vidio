import { Router } from "express";
import { toggleSubscription, getSubscribersList, getSubscribedChannels } from "../controllers/subscription.js";
import verifyToken from "../middlewares/auth.js";

const router = Router();

router.route("/toggle/:channelId").post(verifyToken, toggleSubscription);

router.route("/subscribers/:channelId").get(getSubscribersList);

router.route("/subscribed").get(verifyToken, getSubscribedChannels);

export default router;