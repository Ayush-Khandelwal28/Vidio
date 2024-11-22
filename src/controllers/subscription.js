import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Subscription } from "../models/subscription.model.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const user = req.user;
    const { channelId } = req.params;

    if (!user) {
        throw new ApiError("User is not authenticated", 400);
    }
    if (!channelId) {
        throw new ApiError("Channel ID is required", 400);
    }

    const subscription = await Subscription.findOne({
        subscriber: user._id,
        channel: channelId
    });

    if (subscription) {
        await Subscription.deleteOne({ _id: subscription._id });
        return res.status(200).json(new ApiResponse(200, "Subscription removed successfully", {}));
    }

    const newSubscription = await Subscription.create({
        subscriber: user._id,
        channel: channelId
    });

    if (!newSubscription) {
        throw new ApiError("Failed to subscribe", 500);
    }
    return res.status(201).json(new ApiResponse(201, "Subscribed successfully", newSubscription));
});

const getSubscribersList = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError("Channel ID is required", 400);
    }

    const subscribers = await Subscription.find({ channel: channelId }).populate("subscriber");

    if (!subscribers) {
        throw new ApiError("No subscribers found", 404);
    }

    return res.status(200).json(new ApiResponse(200, "Subscribers list", subscribers));
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError("User is not authenticated", 400);
    }

    const channels = await Subscription.find({ subscriber: user._id }).populate("channel");

    if (!channels) {
        throw new ApiError("No subscribed channels found", 404);
    }

    return res.status(200).json(new ApiResponse(200, "Subscribed channels", channels));
});

export { toggleSubscription, getSubscribersList, getSubscribedChannels };

