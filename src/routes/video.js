import { Router } from "express";
import { publishVideo, updateVideo, deleteVideo, getVideo, togglePublishStatus } from "../controllers/video.js";
import upload from "../middlewares/multer.js";
import verifyToken from "../middlewares/auth.js";

const router = Router();

router.route("/publish").post(
    verifyToken,
    upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    publishVideo
);

router.route("/update/:videoId").patch(verifyToken, updateVideo);

router.route("/delete/:videoId").delete(verifyToken, deleteVideo);

router.route("/watch/:videoId").get(getVideo);

router.route("/togglePublish/:videoId").patch(verifyToken, togglePublishStatus);

export default router;

