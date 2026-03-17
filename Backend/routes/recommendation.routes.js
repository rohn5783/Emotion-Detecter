import express from "express";
import identifyUser from "../middleware/user.middleware.js";
import { getRecommendations } from "../controllers/recommendation.controller.js";

const router = express.Router();

router.get("/", identifyUser, getRecommendations);

export default router;
