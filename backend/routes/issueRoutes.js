import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  createIssue,
  getIssues,
  getIssueById,
  updateIssueStatus,
  assignWorker,
} from "../controllers/issueController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Configure Multer storage in /uploads (relative to backend root)
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
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

// POST /api/issues - resident creates issue with image
router.post(
  "/",
  protect,
  requireRole("resident", "admin"),
  upload.single("image"),
  createIssue
);

// GET /api/issues - list
router.get("/", protect, getIssues);

// GET /api/issues/:id
router.get("/:id", protect, getIssueById);

// PUT /api/issues/:id/status - admin or worker
router.put(
  "/:id/status",
  protect,
  requireRole("admin", "worker"),
  updateIssueStatus
);

// PUT /api/issues/:id/assign - admin only
router.put("/:id/assign", protect, requireRole("admin"), assignWorker);

export default router;

