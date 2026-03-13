import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, MapPin, Brain, CheckCircle2, Clock, AlertCircle, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Issue {
  id: string;
  type: string;
  severity: string;
  budget: string;
  status: "resolved" | "progress" | "pending";
  date: string;
  description: string;
}

const ResidentDashboard = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Auto-detected: 123 Main St, Community A");
  const [showMLResult, setShowMLResult] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [issues, setIssues] = useState<Issue[]>([
    {
      id: "ISS-001",
      type: "Pipeline Leakage",
      severity: "Severe",
      budget: "₹2,500 - ₹3,000",
      status: "progress",
      date: "2025-10-15",
      description: "Water leakage near Building 3",
    },
    {
      id: "ISS-002",
      type: "Garbage Overflow",
      severity: "Moderate",
      budget: "₹800 - ₹1,200",
      status: "resolved",
      date: "2025-10-12",
      description: "Overflow in Zone B bin",
    },
    {
      id: "ISS-003",
      type: "Drainage Block",
      severity: "Minor",
      budget: "₹500 - ₹800",
      status: "pending",
      date: "2025-10-16",
      description: "Slow drainage in parking lot",
    },
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !description) {
      toast.error("Please upload an image and provide a description");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowMLResult(true);
      toast.success("Issue analyzed successfully!");
    }, 2500);
  };

  const handleSendToAdmin = () => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const nextIndex = issues.length + 1;
    const newId = `ISS-${nextIndex.toString().padStart(3, "0")}`;

    const newIssue: Issue = {
      id: newId,
      type: "Pipeline Leakage", // from AI demo result
      severity: "Severe",
      budget: "₹1,500 - ₹2,500",
      status: "pending",
      date: today,
      description: description || "New maintenance issue reported",
    };

    // Update resident's "Your Issues" list
    setIssues((prev) => [newIssue, ...prev]);

    // Also push a simplified copy to worker dashboard demo storage
    try {
      const workerIssue = {
        _id: newId,
        title: newIssue.type,
        description: newIssue.description,
        location,
        imageUrl: "",
        severity: newIssue.severity,
        estimatedBudgetMin: 1500,
        estimatedBudgetMax: 2500,
        status: "Pending" as const,
        createdAt: new Date().toISOString(),
      };

      const raw = localStorage.getItem("workerDemoIssues");
      const existing: typeof workerIssue[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem(
        "workerDemoIssues",
        JSON.stringify([workerIssue, ...existing])
      );
    } catch {
      // ignore demo storage errors
    }

    toast.success("Issue submitted to admin successfully!");
    setShowMLResult(false);
    setDescription("");
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
    toast.success("Logged out successfully");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="w-4 h-4" />;
      case "progress":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center glass-card rounded-2xl p-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Welcome, Resident</h1>
            <p className="text-muted-foreground mt-1">Report and track community maintenance issues</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="bg-white/50 backdrop-blur-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* Report Issue Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card p-6 animate-slide-up">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              Report an Issue
            </h2>

            <div className="space-y-6">
              {/* Upload Section */}
              <div className="space-y-2">
                <Label>Upload Photo</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-white/30 backdrop-blur-sm hover:border-primary transition-colors">
                  {previewUrl ? (
                    <div className="space-y-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg shadow-lg"
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl("");
                        }}
                        className="bg-white/50 backdrop-blur-sm"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm font-medium mb-2">Drop your image here or click to browse</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Describe Your Issue</Label>
                <Textarea
                  placeholder="Provide details about the maintenance issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] bg-white/50 backdrop-blur-sm"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={isAnalyzing}
                variant="premium"
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    AI is analyzing your issue...
                  </>
                ) : (
                  "Submit Issue"
                )}
              </Button>
            </div>
          </Card>

          {/* ML Results */}
          {showMLResult && (
            <Card className="glass-card p-6 animate-fade-in border-2 border-primary/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                AI Analysis Results
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10">
                  <p className="text-sm text-muted-foreground mb-1">Predicted Issue Type</p>
                  <p className="text-lg font-bold">Pipeline Leakage</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-r from-destructive/10 to-warning/10">
                  <p className="text-sm text-muted-foreground mb-1">Severity Level</p>
                  <p className="text-lg font-bold text-destructive">Severe</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-r from-success/10 to-primary/10">
                  <p className="text-sm text-muted-foreground mb-1">Estimated Budget</p>
                  <p className="text-lg font-bold">₹1,500 - ₹2,500</p>
                </div>
                <Button
                  onClick={handleSendToAdmin}
                  variant="premium"
                  className="w-full"
                >
                  Send to Admin Dashboard
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Previous Issues */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Your Issues</h3>
          {issues.map((issue) => (
            <Card
              key={issue.id}
              className="glass-card-hover p-4 animate-fade-in cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold">{issue.type}</p>
                  <p className="text-xs text-muted-foreground">{issue.id}</p>
                </div>
                <span
                  className={`status-badge status-${issue.status} flex items-center gap-1`}
                >
                  {getStatusIcon(issue.status)}
                  {issue.status === "resolved" ? "Resolved" : issue.status === "progress" ? "In Progress" : "Pending"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{issue.date}</span>
                <span className="font-medium text-primary">{issue.budget}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;
