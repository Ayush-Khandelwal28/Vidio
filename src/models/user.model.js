import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "Username is required"],
        index: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"]
    },
    fullName: {
        type: String,
        required: [true, "Full Name is required"]
    },
    avatar: {
        type: String,
        required: [true, "Avatar is required"]
    },
    coverImage: {
        type: String,
    },
    watchHistory: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken: {
        type: String
    },
}, {
    timestamps: true
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
}

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName,
    }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
}

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model("User", userSchema);