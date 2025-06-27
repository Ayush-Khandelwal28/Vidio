import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {

    const channelId = req.params.channelId;
    console.log("Channel ID:", channelId);
    if (!channelId) {
        throw new ApiError(400, "Channel ID is required")
    }
    const videos = await Video.find({ owner: channelId }).sort({ createdAt: -1 });
    if (!videos || videos.length === 0) {
        throw new ApiError(404, "No videos found for this channel")
    }
    const totalVideos = videos.length;
    const totalViews = videos.reduce((acc, video) => acc + video.viewCount, 0);

    const subscribers = await Subscription.find({ channel: channelId }).populate("subscriber");
    const totalSubscribers = subscribers.length;

    const channelStats = {
        totalVideos,
        totalViews,
        totalSubscribers
    };

    res.status(200).json(new ApiResponse(200, "Channel stats fetched successfully", channelStats));
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId = req.params.channelId;
    console.log("Channel ID:", channelId);
    if (!channelId) {
        throw new ApiError(400, "Channel ID is required")
    }
    const videos = await Video.find({ owner: channelId }).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, "Videos fetched successfully", videos))
})

export {
    getChannelStats,
    getChannelVideos
}