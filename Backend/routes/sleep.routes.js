import express from "express";
import identifyUser from "../middleware/user.middleware.js";
import { listSleep, upsertSleep } from "../controllers/sleep.controller.js";

const router = express.Router();

router.put("/", identifyUser, upsertSleep);
router.get("/", identifyUser, listSleep);

export default router;
