import express from "express";
import identifyUser from "../middleware/user.middleware.js";
import { createEntry, deleteEntry, listEntries } from "../controllers/journal.controller.js";

const router = express.Router();

router.post("/", identifyUser, createEntry);
router.get("/", identifyUser, listEntries);
router.delete("/:id", identifyUser, deleteEntry);

export default router;
