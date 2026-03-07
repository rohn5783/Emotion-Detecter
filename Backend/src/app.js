import express from "express";
import cookieparser from "cookie-parser";
import userRouter from "../routes/auth.routes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieparser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/api/auth", userRouter);

export default app;