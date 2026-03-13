import { axiosClient } from "@/api/axiosClient";

export type IssueStatus = "Pending" | "In Progress" | "Resolved";
export type IssueSeverity = "Minor" | "Moderate" | "Severe";

export type IssueUserRef =
  | string
  | {
      _id?: string;
      id?: string;
      name?: string;
      email?: string;
      role?: string;
    }
  | null
  | undefined;

export type Issue = {
  _id: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  issueType?: string;
  severity?: IssueSeverity;
  estimatedBudgetMin?: number;
  estimatedBudgetMax?: number;
  status: IssueStatus;
  reportedBy?: IssueUserRef;
  assignedWorker?: IssueUserRef;
  createdAt?: string;
  updatedAt?: string;
};

const BACKEND_ORIGIN = "http://localhost:5000";

export function getImageUrl(imageUrl: string): string {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
  return `${BACKEND_ORIGIN}${imageUrl}`;
}

export const issueService = {
  async createIssue(formData: FormData): Promise<Issue> {
    const res = await axiosClient.post<Issue>("/issues", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async getAllIssues(): Promise<Issue[]> {
    const res = await axiosClient.get<Issue[]>("/issues");
    return res.data;
  },

  async getUserIssues(): Promise<Issue[]> {
    const res = await axiosClient.get<Issue[]>("/issues/user");
    return res.data;
  },

  async updateIssueStatus(issueId: string, status: IssueStatus): Promise<Issue> {
    const res = await axiosClient.patch<Issue>(`/issues/${issueId}`, { status });
    return res.data;
  },
};

