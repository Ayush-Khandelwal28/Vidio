import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";

export const verifyToken = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers["Authorization"]?.split(" ")[1];
    if (!token) {
        throw new ApiError(401, "Unauthorized");
    }
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken._id);
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }
    req.user = user;
    next();
});

export default verifyToken;