import express from "express";
import cookieparser from "cookie-parser";
import userRouter from "../routes/auth.routes.js";
// import identifyUser from   "../middleware/user.middleware.js";
// import redis from "../config/cache.js";

const app = express();
app.use(express.json());
app.use(cookieparser());



app.use("/api/auth",userRouter);



export default app;