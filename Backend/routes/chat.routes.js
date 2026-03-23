import express from "express";
import identifyUser from "../middleware/user.middleware.js";
import { getChatBootstrap, getDirectMessages } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/bootstrap", identifyUser, getChatBootstrap);
router.get("/dm/:userId", identifyUser, getDirectMessages);

export default router;
