import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  createIssue,
  getAllIssues,
  getUserIssues,
  updateIssueStatus,
} from "../controllers/issueController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer storage config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `issue-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

// POST /api/issues - create new issue
router.post("/", authMiddleware, upload.single("image"), createIssue);

// GET /api/issues - admin: all issues
router.get("/", authMiddleware, getAllIssues);

// GET /api/issues/user - resident: own issues
router.get("/user", authMiddleware, getUserIssues);

// PATCH /api/issues/:id - admin only (simple role check here)
router.patch("/:id", authMiddleware, (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  return updateIssueStatus(req, res, next);
});

export default router;

