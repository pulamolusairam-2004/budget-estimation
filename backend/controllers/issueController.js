import path from "path";
import { Issue } from "../models/Issue.js";
import { IssueEvent } from "../models/IssueEvent.js";
import { analyzeIssueImage } from "../services/aiService.js";

export const createIssue = async (req, res) => {
  try {
    const { description, location } = req.body;

    if (!description || !location) {
      return res.status(400).json({ message: "Description and location are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const imagePath = path.join("uploads", req.file.filename);

    const baseIssue = await Issue.create({
      reporterUserId: req.user._id,
      description,
      location,
      imageUrl: imagePath,
      status: "Pending",
      analysisStatus: "processing",
    });

    // Simulate AI analysis synchronously for now.
    const aiResult = await analyzeIssueImage(imagePath, description);

    baseIssue.issueType = aiResult.issueType;
    baseIssue.severity = aiResult.severity;
    baseIssue.estimatedBudgetMin = aiResult.estimatedBudgetMin;
    baseIssue.estimatedBudgetMax = aiResult.estimatedBudgetMax;
    baseIssue.analysisStatus = "completed";
    await baseIssue.save();

    await IssueEvent.create({
      issueId: baseIssue._id,
      actorUserId: req.user._id,
      eventType: "CREATED",
      fromValue: null,
      toValue: {
        status: baseIssue.status,
        issueType: baseIssue.issueType,
        severity: baseIssue.severity,
      },
    });

    return res.status(201).json(baseIssue);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getIssues = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (req.user.role === "resident") {
      filter.reporterUserId = req.user._id;
    } else if (req.user.role === "worker") {
      filter.assignedWorkerId = req.user._id;
    }

    const issues = await Issue.find(filter)
      .sort({ createdAt: -1 })
      .populate("reporterUserId", "name email role")
      .populate("assignedWorkerId", "name email role");

    return res.json(issues);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id)
      .populate("reporterUserId", "name email role")
      .populate("assignedWorkerId", "name email role");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (req.user.role === "resident" && !issue.reporterUserId.equals(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (req.user.role === "worker" && !issue.assignedWorkerId?.equals(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.json(issue);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

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

    const prevStatus = issue.status;
    issue.status = status;
    await issue.save();

    await IssueEvent.create({
      issueId: issue._id,
      actorUserId: req.user._id,
      eventType: "STATUS_CHANGED",
      fromValue: { status: prevStatus },
      toValue: { status },
    });

    return res.json(issue);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const assignWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const { workerId } = req.body;

    if (!workerId) {
      return res.status(400).json({ message: "workerId is required" });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const prevWorkerId = issue.assignedWorkerId;
    issue.assignedWorkerId = workerId;
    await issue.save();

    await IssueEvent.create({
      issueId: issue._id,
      actorUserId: req.user._id,
      eventType: "ASSIGNED",
      fromValue: { assignedWorkerId: prevWorkerId },
      toValue: { assignedWorkerId: workerId },
    });

    return res.json(issue);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

