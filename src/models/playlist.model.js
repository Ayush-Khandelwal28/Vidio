import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    description: {
        type: String,
    },
    videos: [{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

export const Playlist = mongoose.model("Playlist", playlistSchema);