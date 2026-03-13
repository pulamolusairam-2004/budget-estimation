import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { getImageUrl, type IssueSeverity } from "@/api/issueService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Static demo tasks for presentation (no backend)
const DEMO_TASKS = [
  {
    _id: "ISS-101",
    title: "Pipeline Leakage - Block A",
    description: "Water leakage observed in Block A basement near pump room.",
    location: "Block A - Basement",
    imageUrl: "",
    severity: "Severe" as IssueSeverity,
    estimatedBudgetMin: 1500,
    estimatedBudgetMax: 2500,
    status: "Pending" as const,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "ISS-102",
    title: "Garbage Overflow - Zone B",
    description: "Bins overflowing during morning shift, requires immediate clearance.",
    location: "Zone B - Main Gate",
    imageUrl: "",
    severity: "Moderate" as IssueSeverity,
    estimatedBudgetMin: 800,
    estimatedBudgetMax: 1200,
    status: "In Progress" as const,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "ISS-103",
    title: "Street Light Not Working",
    description: "Street light flickering near parking lot entry.",
    location: "Parking Entry",
    imageUrl: "",
    severity: "Minor" as IssueSeverity,
    estimatedBudgetMin: 400,
    estimatedBudgetMax: 700,
    status: "Resolved" as const,
    createdAt: new Date().toISOString(),
  },
];

function severityBadgeClasses(severity?: IssueSeverity) {
  switch (severity) {
    case "Severe":
      return "bg-destructive/10 text-destructive border border-destructive/20";
    case "Moderate":
      return "bg-warning/10 text-warning border border-warning/20";
    case "Minor":
      return "bg-success/10 text-success border border-success/20";
    default:
      return "bg-muted text-muted-foreground border border-border";
  }
}

function formatBudget(min?: number, max?: number) {
  if (typeof min === "number" && typeof max === "number") return `₹${min} - ₹${max}`;
  if (typeof min === "number") return `₹${min}+`;
  return "—";
}

type DemoTask = (typeof DEMO_TASKS)[number];

const loadInitialTasks = (): DemoTask[] => {
  try {
    const raw = localStorage.getItem("workerDemoIssues");
    if (!raw) return DEMO_TASKS;
    const extra: DemoTask[] = JSON.parse(raw);
    return [...extra, ...DEMO_TASKS];
  } catch {
    return DEMO_TASKS;
  }
};

const WorkerDashboard = () => {
  const [tasks, setTasks] = useState<DemoTask[]>(loadInitialTasks);

  const stats = useMemo(() => {
    const pending = tasks.filter((t) => t.status === "Pending");
    const inProgress = tasks.filter((t) => t.status === "In Progress");
    const completed = tasks.filter((t) => t.status === "Resolved");
    return {
      totalAssigned: tasks.length,
      pending: pending.length,
      inProgress: inProgress.length,
      completed: completed.length,
    };
  }, [tasks]);

  const setStatus = (issueId: string, status: "Pending" | "In Progress" | "Resolved") => {
    // Demo-only: locally update the task status so UI reflects the change.
    setTasks((prev) => {
      const updated = prev.map((task) =>
        task._id === issueId ? { ...task, status } : task
      );

      // Persist only resident-created issues back to localStorage
      try {
        const residentIssues = updated.filter(
          (t) => !DEMO_TASKS.some((d) => d._id === t._id)
        );
        localStorage.setItem("workerDemoIssues", JSON.stringify(residentIssues));
      } catch {
        // ignore demo storage errors
      }

      return updated;
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Worker Maintenance Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage assigned maintenance tasks and update statuses.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-card p-5">
            <p className="text-sm text-muted-foreground">Total Assigned Tasks</p>
            <p className="text-3xl font-bold gradient-text mt-2">{stats.totalAssigned}</p>
          </Card>
          <Card className="glass-card p-5">
            <p className="text-sm text-muted-foreground">Pending Tasks</p>
            <p className="text-3xl font-bold gradient-text mt-2">{stats.pending}</p>
          </Card>
          <Card className="glass-card p-5">
            <p className="text-sm text-muted-foreground">Tasks In Progress</p>
            <p className="text-3xl font-bold gradient-text mt-2">{stats.inProgress}</p>
          </Card>
          <Card className="glass-card p-5">
            <p className="text-sm text-muted-foreground">Completed Tasks</p>
            <p className="text-3xl font-bold gradient-text mt-2">{stats.completed}</p>
          </Card>
        </div>

        {/* Empty state */}
        {tasks.length === 0 ? (
          <Card className="glass-card p-10 text-center">
            <p className="text-muted-foreground">No maintenance tasks assigned yet.</p>
          </Card>
        ) : (
          <>
            {/* Desktop / tablet table */}
            <Card className="glass-card p-0 overflow-hidden hidden md:block">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-white/50">
                    <tr className="text-left">
                      <th className="p-4 font-semibold">Issue</th>
                      <th className="p-4 font-semibold">Location</th>
                      <th className="p-4 font-semibold">Severity</th>
                      <th className="p-4 font-semibold">Budget</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Reported</th>
                      <th className="p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((issue) => {
                      const img = getImageUrl(issue.imageUrl);
                      const disabled = false;
                      return (
                        <tr key={issue._id} className="border-t border-white/20">
                          <td className="p-4">
                            <div className="flex items-center gap-3 min-w-[260px]">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0 border border-white/30">
                                {img ? (
                                  <img src={img} alt={issue.title} className="w-full h-full object-cover" />
                                ) : null}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold truncate">{issue.title}</p>
                                <p className="text-muted-foreground truncate">{issue.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground">{issue.location}</td>
                          <td className="p-4">
                            <span className={`status-badge ${severityBadgeClasses(issue.severity)}`}>
                              {issue.severity ?? "—"}
                            </span>
                          </td>
                          <td className="p-4 font-medium">{formatBudget(issue.estimatedBudgetMin, issue.estimatedBudgetMax)}</td>
                          <td className="p-4">
                            <Select
                              value={issue.status}
                              onValueChange={(v) =>
                                setStatus(issue._id, v as "Pending" | "In Progress" | "Resolved")
                              }
                              disabled={disabled}
                            >
                              <SelectTrigger className="w-[160px] bg-white/50 backdrop-blur-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white/95 backdrop-blur-xl">
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                            {issue.status === "Resolved" && (
                              <div className="mt-2 flex items-center gap-1 text-sm text-success">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Completed</span>
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : "—"}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-white/60 backdrop-blur-sm"
                                disabled={disabled || issue.status === "In Progress"}
                                onClick={() => setStatus(issue._id, "In Progress")}
                              >
                                Start Work
                              </Button>
                              <Button
                                size="sm"
                                variant="premium"
                                disabled={disabled || issue.status === "Resolved"}
                                onClick={() => setStatus(issue._id, "Resolved")}
                              >
                                Mark Completed
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Mobile cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {tasks.map((issue) => {
                const img = getImageUrl(issue.imageUrl);
                const disabled = false;
                return (
                  <Card key={issue._id} className="glass-card p-5 space-y-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-white/30">
                        {img ? <img src={img} alt={issue.title} className="w-full h-full object-cover" /> : null}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold">{issue.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{issue.description}</p>
                        <div className="mt-2 flex flex-wrap gap-2 items-center">
                          <span className={`status-badge ${severityBadgeClasses(issue.severity)}`}>
                            {issue.severity ?? "—"}
                          </span>
                          <span className="text-sm font-medium">{formatBudget(issue.estimatedBudgetMin, issue.estimatedBudgetMax)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p><span className="font-medium text-foreground">Location:</span> {issue.location}</p>
                      <p className="mt-1">
                        <span className="font-medium text-foreground">Reported:</span>{" "}
                        {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : "—"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Select
                        value={issue.status}
                        onValueChange={(v) =>
                          setStatus(issue._id, v as "Pending" | "In Progress" | "Resolved")
                        }
                        disabled={disabled}
                      >
                        <SelectTrigger className="w-full bg-white/50 backdrop-blur-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-xl">
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        variant="outline"
                        disabled={disabled || issue.status === "In Progress"}
                        onClick={() => setStatus(issue._id, "In Progress")}
                      >
                        Start Work
                      </Button>
                      <Button
                        className="flex-1"
                        variant="premium"
                        disabled={disabled || issue.status === "Resolved"}
                        onClick={() => setStatus(issue._id, "Resolved")}
                      >
                        Mark Completed
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkerDashboard;

