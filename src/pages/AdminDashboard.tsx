import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Users,
  LogOut,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Issue {
  id: string;
  type: string;
  severity: "Minor" | "Moderate" | "Severe";
  cost: string;
  status: "Pending" | "In Progress" | "Resolved";
  worker: string;
  date: string;
  image: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
    toast.success("Logged out successfully");
  };

  const stats = [
    {
      title: "Total Issues Today",
      value: "24",
      icon: AlertCircle,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Pending Issues",
      value: "8",
      icon: AlertCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Avg Budget Estimate",
      value: "₹1,850",
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Resolved %",
      value: "67%",
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  const issueTypeData = [
    { name: "Pipeline", value: 35, color: "#4F9EFF" },
    { name: "Garbage", value: 25, color: "#A855F7" },
    { name: "Drainage", value: 20, color: "#10B981" },
    { name: "Electric", value: 12, color: "#F59E0B" },
    { name: "Other", value: 8, color: "#EF4444" },
  ];

  const severityData = [
    { name: "Minor", count: 12 },
    { name: "Moderate", count: 18 },
    { name: "Severe", count: 6 },
  ];

  const budgetTrendData = [
    { month: "Jul", budget: 1200 },
    { month: "Aug", budget: 1500 },
    { month: "Sep", budget: 1800 },
    { month: "Oct", budget: 1650 },
  ];

  const issues: Issue[] = [
    {
      id: "ISS-024",
      type: "Pipeline Leakage",
      severity: "Severe",
      cost: "₹2,500",
      status: "Pending",
      worker: "Unassigned",
      date: "2025-10-17",
      image: "🚰",
    },
    {
      id: "ISS-023",
      type: "Garbage Overflow",
      severity: "Moderate",
      cost: "₹800",
      status: "In Progress",
      worker: "Rajesh Kumar",
      date: "2025-10-17",
      image: "🗑️",
    },
    {
      id: "ISS-022",
      type: "Drainage Block",
      severity: "Minor",
      cost: "₹600",
      status: "Resolved",
      worker: "Amit Singh",
      date: "2025-10-16",
      image: "🚿",
    },
    {
      id: "ISS-021",
      type: "Street Light",
      severity: "Minor",
      cost: "₹450",
      status: "In Progress",
      worker: "Priya Sharma",
      date: "2025-10-16",
      image: "💡",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Severe":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Moderate":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-success/10 text-success border-success/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-success/10 text-success border-success/20";
      case "In Progress":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-destructive/10 text-destructive border-destructive/20";
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="max-w-[1600px] mx-auto mb-8">
        <div className="glass-card rounded-2xl p-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-1">Admin Dashboard</h1>
            <p className="text-muted-foreground">AI-Powered Maintenance Control Center</p>
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

      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="glass-card-hover p-6 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${stat.bgColor} shadow-lg`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/10">
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-xs font-medium text-success">+12%</span>
            </div>
          </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-3xl font-bold gradient-text">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Issue Types Pie Chart */}
          <Card className="glass-card p-6 animate-slide-up">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Issue Types Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={issueTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {issueTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {issueTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Severity Levels */}
          <Card className="glass-card p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <h3 className="text-lg font-bold mb-4">Severity Levels</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#4F9EFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Budget Trend */}
          <Card className="glass-card p-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <h3 className="text-lg font-bold mb-4">Average Budget Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={budgetTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="budget"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Issue Feed Table */}
        <Card className="glass-card p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="gradient-text">Live Issue Feed</span>
            </h3>
            <Button size="sm" variant="premium">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {issues.map((issue, index) => (
              <div
                key={issue.id}
                className="glass-card p-4 hover:shadow-lg transition-all duration-300 rounded-xl animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-4xl">{issue.image}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold">{issue.type}</p>
                        <Badge className={`status-badge ${getSeverityColor(issue.severity)}`}>
                          {issue.severity}
                        </Badge>
                        <Badge className={`status-badge ${getStatusColor(issue.status)}`}>
                          {issue.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>ID: {issue.id}</span>
                        <span>•</span>
                        <span>{issue.date}</span>
                        <span>•</span>
                        <span>Worker: {issue.worker}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Estimated Cost</p>
                      <p className="text-lg font-bold gradient-gold">{issue.cost}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/60 backdrop-blur-sm border-2"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
