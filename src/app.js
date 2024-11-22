import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: "*", 
}));

app.use(express.json({
    limit: "1mb"
}));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.use(cookieParser());

//routes
import userRouter from "./routes/user.js";
import videoRouter from "./routes/video.js";
import playlistRouter from "./routes/playlist.js";
import commentRouter from "./routes/comment.js";
import subscriptionRouter from "./routes/subscription.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

export default app;