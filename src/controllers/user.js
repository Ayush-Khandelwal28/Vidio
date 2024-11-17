import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { DEFAULT_AVATAR_URL, DEFAULT_COVER_IMAGE_URL } from "../constants.js";
import { User } from "../models/user.model.js";
import uploadFile from "../utils/fileUploadToCloudinary.js";

const registerUser = asyncHandler(async (req, res) => {

    const { fullName, username, email, password } = await req.body;
    if (!fullName || !email || !password || !username) {
        return new ApiError(400, "Please provide all required fields");
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
        else return new ApiError(500, "Failed to upload avatar");
    }

    const coverImagePath = req.files?.coverImage?.[0]?.path;
    if (coverImagePath) {
        const coverImage = await uploadFile(coverImagePath);
        if (coverImage.url) coverImageUrl = coverImage.url;
        else return new ApiError(500, "Failed to upload cover image");
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

export { registerUser }; 