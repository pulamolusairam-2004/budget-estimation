import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { issueService, type Issue, type IssueStatus } from "@/api/issueService";

const ALL_ISSUES_KEY = ["issues", "all"];
const USER_ISSUES_KEY = ["issues", "user"];

export function useAllIssues() {
  return useQuery<Issue[], Error>({
    queryKey: ALL_ISSUES_KEY,
    queryFn: () => issueService.getAllIssues(),
  });
}

export function useUserIssues() {
  return useQuery<Issue[], Error>({
    queryKey: USER_ISSUES_KEY,
    queryFn: () => issueService.getUserIssues(),
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();
  return useMutation<Issue, Error, FormData>({
    mutationFn: (formData) => issueService.createIssue(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALL_ISSUES_KEY });
      queryClient.invalidateQueries({ queryKey: USER_ISSUES_KEY });
    },
  });
}

export function useUpdateIssueStatus() {
  const queryClient = useQueryClient();
  return useMutation<Issue, Error, { issueId: string; status: IssueStatus }>({
    mutationFn: ({ issueId, status }) => issueService.updateIssueStatus(issueId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALL_ISSUES_KEY });
      queryClient.invalidateQueries({ queryKey: USER_ISSUES_KEY });
    },
  });
}

