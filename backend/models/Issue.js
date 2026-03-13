import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    reporterUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedWorkerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
      required: true,
    },
    issueType: {
      type: String,
    },
    severity: {
      type: String,
      enum: ["Minor", "Moderate", "Severe"],
    },
    estimatedBudgetMin: {
      type: Number,
    },
    estimatedBudgetMax: {
      type: Number,
    },
    analysisStatus: {
      type: String,
      enum: ["queued", "processing", "completed"],
      default: "queued",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const Issue = mongoose.model("Issue", issueSchema);

