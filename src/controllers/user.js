import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { DEFAULT_AVATAR_URL, DEFAULT_COVER_IMAGE_URL } from "../constants.js";
import { User } from "../models/user.model.js";
import uploadFile from "../utils/fileUploadToCloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Failed to generate access and refresh tokens");
    }
}

const options = {
    secure: true,
    httpOnly: true
};

const registerUser = asyncHandler(async (req, res) => {

    const { fullName, username, email, password } = await req.body;
    if (!fullName || !email || !password || !username) {
        throw new ApiError(400, "Please provide all required fields");
    }
    const userExists = await User.findOne({
        $or: [{ email }, { username }]
    });
    if (userExists) {
        throw new ApiError(409, "User already exists");
    }

    let avatarUrl = DEFAULT_AVATAR_URL;
    let coverImageUrl = DEFAULT_COVER_IMAGE_URL;

    const avatarPath = req.files?.avatar?.[0]?.path;
    if (avatarPath) {
        const avatar = await uploadFile(avatarPath);
        if (avatar.url) avatarUrl = avatar.url;
        else throw new ApiError(500, "Failed to upload avatar");
    }

    const coverImagePath = req.files?.coverImage?.[0]?.path;
    if (coverImagePath) {
        const coverImage = await uploadFile(coverImagePath);
        if (coverImage.url) coverImageUrl = coverImage.url;
        else throw new ApiError(500, "Failed to upload cover image");
    }

    const user = await User.create({
        fullName,
        username,
        email,
        password,
        avatar: avatarUrl,
        coverImage: coverImageUrl
    });

    const userId = User.findById(user._id);

    if (!userId) {
        return new ApiError(500, "Failed to register user");
    }

    return res.status(201).json(new ApiResponse(201, "User registered successfully", user));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    if (!email && !username) {
        throw new ApiError(400, "Please provide either email or username");
    }
    if (!password) {
        throw new ApiError(400, "Please provide password");
    }
    const user = await User
        .findOne({
            $or: [{ email }, { username }]
        });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const updatedUser = await User.findById(user._id).select("-password");

    res.cookie("refreshToken", refreshToken, options);
    res.cookie("accessToken", accessToken, options);

    return res.status(200).json(
        new ApiResponse(200, "Login successful", {
            user: updatedUser,
            accessToken,
            refreshToken,
        })
    );
});

const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, {
        $set: { refreshToken: undefined }
    }, { new: true });

    res.clearCookie("refreshToken", options);
    res.clearCookie("accessToken", options);
    return res.status(200).json(new ApiResponse(200, "Logout successful"));
});

const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;
    if (!currentPassword || !newPassword) {
        throw new ApiError(400, "Please provide current and new password");
    }
    const user = await User.findById(userId);
    const isMatch = await user.isPasswordCorrect(currentPassword);
    if (!isMatch) {
        throw new ApiError(401, "Invalid current password");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, "User found", user));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        throw new ApiError(401, "Unauthorized");
    }
    const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken._id);
    if (!user) {
        throw new ApiError(401, "Invalid token");
    }
    if (refreshToken !== user.refreshToken) {
        throw new ApiError(401, "Invalid token");
    }
    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);
    res.cookie("refreshToken", newRefreshToken, options);
    res.cookie("accessToken", accessToken, options);
    return res.status(200).json(
        new ApiResponse(200, "Token refreshed successfully", {
            user,
            accessToken,
            refreshToken: newRefreshToken
        })
    );
});

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarPath = req.file?.path;
    if (!avatarPath) {
        throw new ApiError(400, "Avatar File is missing");
    }
    const avatar = await uploadFile(avatarPath);
    if (!avatar.url) {
        throw new ApiError(500, "Failed to upload avatar");
    }
    const user = req.user;
    user.avatar = avatar.url;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, "Avatar updated successfully", user));
});

const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImagePath = req.file?.path;
    if (!coverImagePath) {
        throw new ApiError(400, "Cover Image File is missing");
    }
    const coverImage = await uploadFile(coverImagePath);
    if (!coverImage.url) {
        throw new ApiError(500, "Failed to upload cover image");
    }
    const user = req.user;
    user.coverImage = coverImage.url;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, "Cover Image updated successfully", user));
});

export { registerUser, loginUser, logoutUser, changePassword, getCurrentUser, refreshAccessToken, updateAvatar, updateCoverImage }; 