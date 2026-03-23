import express from "express";
import cookieparser from "cookie-parser";
import userRouter from "../routes/auth.routes.js";
import moodRouter from "../routes/mood.routes.js";
import journalRouter from "../routes/journal.routes.js";
import sleepRouter from "../routes/sleep.routes.js";
import recommendationRouter from "../routes/recommendation.routes.js";
import userListRouter from "../routes/user.routes.js";
import chatRouter from "../routes/chat.routes.js";
import uploadRouter from "../routes/upload.routes.js";
import cors from "cors";
import path from "path";
import { corsOptions } from "../config/cors.js";

const app = express();

app.use(express.json());
app.use(cookieparser());
app.use(cors(corsOptions));

app.use("/api/auth", userRouter);
app.use("/api/mood", moodRouter);
app.use("/api/journal", journalRouter);
app.use("/api/sleep", sleepRouter);
app.use("/api/recommendations", recommendationRouter);
app.use("/api/users", userListRouter);
app.use("/api/chat", chatRouter);
app.use("/api/upload", uploadRouter);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

export default app;
