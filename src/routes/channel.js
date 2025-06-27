import { getChannelVideos, getChannelStats } from "../controllers/channel.js";

import { Router } from 'express';

const router = Router();

router.get("/:channelId/videos", getChannelVideos);
router.get("/:channelId/stats", getChannelStats);

export default router;
