import express from "express";
import identifyUser from "../middleware/user.middleware.js";
import { createMoodLog, listMoodLogs, moodAnalytics } from "../controllers/mood.controller.js";

const router = express.Router();

router.post("/log", identifyUser, createMoodLog);
router.get("/logs", identifyUser, listMoodLogs);
router.get("/analytics", identifyUser, moodAnalytics);

export default router;
