import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        required: [true, "Content is required"],
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

export const Comment = mongoose.model("Comment", commentSchema);