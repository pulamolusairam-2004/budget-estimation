// Placeholder AI service. In Phase 4 this will call a real
// vision model (e.g. OpenAI Vision) and return parsed results.

export const analyzeIssueImage = async (_imagePath, _description) => {
  // For now, simulate a fixed response.
  return {
    issueType: "Pipeline Leakage",
    severity: "Severe",
    estimatedBudgetMin: 1500,
    estimatedBudgetMax: 2500,
  };
};

