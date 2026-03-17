import express from "express";
import identifyUser from "../middleware/user.middleware.js";
import { listUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", identifyUser, listUsers);

export default router;
