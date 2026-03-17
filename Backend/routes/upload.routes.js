import express from "express";
import identifyUser from "../middleware/user.middleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const safeExt = ext && ext.length <= 10 ? ext : "";
    cb(null, `${req.user._id}-${Date.now()}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

router.post("/profile", identifyUser, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  // For MVP we just return the URL. (Cloud storage can be added later.)
  res.status(201).json({ message: "Uploaded", url: `/uploads/${req.file.filename}` });
});

export default router;

