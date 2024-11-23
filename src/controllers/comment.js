import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Comment } from "../models/comment.model.js";

const createComment = asyncHandler(async (req, res) => {
    const { content, videoId } = req.body;
    const user = req.user;
    if (!content) {
        throw new ApiError("Comment Content is required", 400);
    }
    if (!videoId) {
        throw new ApiError("Video ID is required", 400);
    }
    if (!user) {
        throw new ApiError("User is not authenticated", 400);
    }

    const addComment = await Comment.create({
        content: content,
        video: videoId,
        user: user._id
    });
    if (!addComment) {
        throw new ApiError("Failed to add comment", 500);
    }
    return res.status(201).json(new ApiResponse(201, "Comment added successfully", addComment));
});

const updateComment = asyncHandler(async (req, res) => {
    const { content, commentId } = req.body;
    const user = req.user;
    if (!content) {
        throw new ApiError("Comment Content is required", 400);
    }
    if (!commentId) {
        throw new ApiError("Comment ID is required", 400);
    }
    if (!user) {
        throw new ApiError("User is not authenticated", 400);
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError("Comment not found", 404);
    }
    if (comment.user.toString() !== user._id.toString()) {
        throw new ApiError("You are not authorized to update this comment", 403);
    }
    comment.content = content;
    await comment.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, "Comment updated successfully", comment));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.body;
    const user = req.user;
    if (!commentId) {
        throw new ApiError("Comment ID is required", 400);
    }
    if (!user) {
        throw new ApiError("User is not authenticated", 400);
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError("Comment not found", 404);
    }
    if (comment.user.toString() !== user._id.toString()) {
        throw new ApiError("You are not authorized to delete this comment", 403);
    }
    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json(new ApiResponse(200, "Comment deleted successfully", comment));
});

const getAllComments = asyncHandler(async (req, res) => {
    const { videoId } = req.body;
    console.log(videoId);
    if (!videoId) {
        throw new ApiError("Video ID is required", 400);
    }
    const comments = await Comment.find({ video: videoId }).populate("user");
    if (!comments.length) {
        throw new ApiError("No comments found", 404);
    }
    return res.status(200).json(new ApiResponse(200, "Comments retrieved successfully", comments));
});

export { createComment, updateComment, deleteComment, getAllComments };