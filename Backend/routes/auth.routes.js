import express from 'express';
import authController from '../controllers/auth.controller.js';
import identifyUser from '../middleware/user.middleware.js';
const userRouter = express.Router();

userRouter.post("/register",authController.registerUser);
userRouter.post("/login",authController.loginUser);
userRouter.get("/getUser",identifyUser,authController.getUser);
userRouter.get("/logout",authController.logoutUser);




export default userRouter;