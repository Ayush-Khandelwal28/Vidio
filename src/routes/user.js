import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, changePassword, updateAvatar, updateCoverImage } from "../controllers/user.js";
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

router.route("/changePassword").post(verifyToken, changePassword);

router.route("/updateAvatar").post(verifyToken, upload.single("avatar"), updateAvatar);

router.route("/updateCoverImage").post(verifyToken, upload.single("coverImage"), updateCoverImage);

export default router;