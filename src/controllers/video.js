import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Video } from '../models/video.model.js';
import uploadFile from "../utils/fileUploadToCloudinary.js";
import uploadVideo from "../utils/videoUploadToAWS.js";

const publishVideo = asyncHandler(async (req, res, next) => {
    const { title, description } = req.body;
    const user = req.user;
    if (!user) {
        return next(new ApiError("User not found", 404));
    }
    if (!title || !description) {
        return next(new ApiError("Please provide all required fields", 400));
    }
    const videoPath = req.files?.videoFile?.[0]?.path;
    const thumbnailPath = req.files?.thumbnail?.[0]?.path;
    if (!videoPath || !thumbnailPath) {
        return next(new ApiError("Please provide video and thumbnail", 400));
    }
    const { url, durationInSeconds } = await uploadVideo(videoPath);
    if (!url) {
        return next(new ApiError("Failed to upload video", 500));
    }
    const thumbnailUpload = await uploadFile(thumbnailPath);
    if (!thumbnailUpload) {
        return next(new ApiError("Failed to upload thumbnail", 500));
    }
    const thumbnailUrl = thumbnailUpload.url;
    const video = await Video.create({
        videoFile: url,
        title: title,
        description: description,
        thumbnail: thumbnailUrl,
        duration: durationInSeconds,
        owner: user._id
    });
    res.status(201).json(new ApiResponse(201, "Video published successfully", video));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { title, description, thumbnailUrl } = req.body;
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError("Video not found", 404);
    }
    if (title !== undefined) video.title = title;
    if (description !== undefined) video.description = description;
    if (thumbnailUrl !== undefined) video.thumbnail = thumbnailUrl;

    await video.save({ validateBeforeSave: false });

    res.status(200).json(new ApiResponse(200, "Video updated successfully", video));
});


const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const user = req.user;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError("Video not found", 404);
    }

    if (video.owner.toString() !== user._id.toString()) {
        throw new ApiError("You are not authorized to delete this video", 403);
    }

    await Video.findByIdAndDelete(videoId);
    res.status(204).json(new ApiResponse(204, "Video deleted successfully", null));
});


const getVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError("Video not found", 404);
    }
    video.viewCount += 1;
    await video.save({ validateBeforeSave: false });
    res.status(200).json(new ApiResponse(200, "Video retrieved Successfully", video));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if (!video) {
        return next(new ApiError("Video not found", 404));
    }
    video.isPublished = !video.isPublished;
    await video.save({ validateBeforeSave: false });
    res.status(200).json(new ApiResponse(200, "Video updated Successfully", video));
});

export { publishVideo, updateVideo, deleteVideo, getVideo, togglePublishStatus };