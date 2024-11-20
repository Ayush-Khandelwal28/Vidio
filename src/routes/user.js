import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken } from "../controllers/user.js";
import upload from "../middlewares/multer.js";
import verifyToken from "../middlewares/auth.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyToken, logoutUser);

router.route("/refreshToken").post(refreshAccessToken);

export default router;