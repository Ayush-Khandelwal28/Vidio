import { Router } from "express";
import {createComment, updateComment, deleteComment, getAllComments} from "../controllers/comment.js";
import verifyToken from "../middlewares/auth.js";

const router = Router();

router.route("/create").post(verifyToken, createComment);

router.route("/update").patch(verifyToken, updateComment);

router.route("/delete").delete(verifyToken, deleteComment);

router.route("/all").get(getAllComments);

export default router;
