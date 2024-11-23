import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Playlist } from '../models/playlist.model.js';

const createPlaylist = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const user = req.user;
    if (!title) {
        throw new ApiError("Playlist title is required", 400);
    }
    if (!user) {
        throw new ApiError("User is not authenticated", 400);
    }

    const playlist = await Playlist.create({
        title: title,
        description: description || "",
        creator: user._id
    })
    if (!playlist) {
        throw new ApiError("Failed to create playlist", 500);
    }
    return res.status(201).json(new ApiResponse(201, "Playlist created successfully", playlist));
});

const updatePlaylistDetails = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const user = req.user;
    const { playlistId } = req.params;
    if (!user) {
        throw new ApiError("User is not authenticated", 400);
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError("Playlist not found", 404);
    }
    if (playlist.creator.toString() !== user._id.toString()) {
        throw new ApiError("You are not authorized to update this playlist", 403);
    }
    if (title !== undefined) playlist.title = title;
    if (description !== undefined) playlist.description = description;
    await playlist.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, "Playlist updated successfully", playlist));
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const user = req.user;
    const { playlistId } = req.params;
    if (!playlistId) {
        throw new ApiError("Playlist ID is required", 400);
    }
    if (!user) {
        throw new ApiError("User is not authenticated", 400);
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError("Playlist not found", 404);
    }
    if (playlist.creator.toString() !== user._id.toString()) {
        throw new ApiError("You are not authorized to delete this playlist", 403);
    }
    await Playlist.findByIdAndDelete(playlistId);
    return res.status(200).json(new ApiResponse(200, "Playlist deleted successfully", {}));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { videoId } = req.body;
    const { playlistId } = req.params;
    const user = req.user;
    if (!playlistId) {
        throw new ApiError("Playlist ID is required", 400);
    }
    if (!videoId) {
        throw new ApiError("Video ID is required", 400);
    }
    if (!user) {
        throw new ApiError("User is not authenticated", 400);
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError("Playlist not found", 404);
    }
    if (playlist.creator.toString() !== user._id.toString()) {
        throw new ApiError("You are not authorized to add video to this playlist", 403);
    }
    playlist.videos.push(videoId);
    await playlist.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, "Video added to playlist successfully", playlist));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { videoId } = req.body;
    const { playlistId } = req.params;
    const user = req.user;
    if (!playlistId) {
        throw new ApiError("Playlist ID is required", 400);
    }
    if (!videoId) {
        throw new ApiError("Video ID is required", 400);
    }
    if (!user) {
        throw new ApiError("User is not authenticated", 400);
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError("Playlist not found", 404);
    }
    if (playlist.creator.toString() !== user._id.toString()) {
        throw new ApiError("You are not authorized to remove video from this playlist", 403);
    }
    playlist.videos = playlist.videos.filter(v => v.toString() !== videoId.toString());
    await playlist.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, "Video removed from playlist successfully", playlist));
});

const getUserPlaylist = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError("User is not authenticated", 400);
    }
    const playlists = await Playlist.find({ creator: user._id });
    if (!playlists) {
        throw new ApiError("No playlists found", 404);
    }
    return res.status(200).json(new ApiResponse(200, "Playlists found", playlists));
});

const getPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError("Playlist not found", 404);
    }
    return res.status(200).json(new ApiResponse(200, "Playlist found", playlist));
});

export { createPlaylist, updatePlaylistDetails, deletePlaylist, addVideoToPlaylist, removeVideoFromPlaylist, getUserPlaylist, getPlaylist };
