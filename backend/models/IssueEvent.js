import mongoose from "mongoose";

const issueEventSchema = new mongoose.Schema(
  {
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
    actorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      trim: true,
    },
    fromValue: {
      type: mongoose.Schema.Types.Mixed,
    },
    toValue: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

export const IssueEvent = mongoose.model("IssueEvent", issueEventSchema);

