import { Issue } from "../models/Issue.js";

// POST /api/issues
export const createIssue = async (req, res) => {
  try {
    const { title, description, location } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ message: "Title, description, and location are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const issue = await Issue.create({
      title,
      description,
      location,
      imageUrl,
      status: "Pending",
      reportedBy: req.user._id,
    });

    return res.status(201).json(issue);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/issues (admin - all issues)
export const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .sort({ createdAt: -1 })
      .populate("reportedBy", "name email role");

    return res.json(issues);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/issues/user (resident - own issues)
export const getUserIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user._id })
      .sort({ createdAt: -1 });

    return res.json(issues);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PATCH /api/issues/:id (admin only)
export const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "In Progress", "Resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.status = status;
    await issue.save();

    return res.json(issue);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

