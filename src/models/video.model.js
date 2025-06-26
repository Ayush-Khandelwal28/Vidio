import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videoFile: {
        type: String,
        required: [true, "Video File is required"]
    },
    title: {
        type: String,
        required: [true, "Title is required"],
        index: true
    },
    transcodingStatus: {
        type: String,
        enum: ["pending", "in-progress", "completed", "failed"],
        default: "pending"
    },
    resolutions: {
        type: Map,
        of: String,
        default: {},
    },
    availableResolutions: {
        type: [String], 
        default: [],
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    thumbnail: {
        type: String,
        required: [true, "Thumbnail is required"]
    },
    viewCount: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number,
        required: [true, "Duration is required"]
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Owner is required"]
    },
}, {
    timestamps: true
});

videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video", videoSchema);