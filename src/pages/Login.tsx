import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"resident" | "admin" | "worker" | "">("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !role) return;

    // Demo-only login: no backend, just store role locally
    localStorage.setItem("userRole", role);

    if (role === "admin") navigate("/admin");
    else if (role === "resident") navigate("/resident");
    else navigate("/worker");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/95 via-background/90 to-slate-100/95" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-glow/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Login Card */}
      <div className="glass-card rounded-2xl p-8 w-full max-w-md relative z-10 animate-fade-in shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-primary-glow to-accent mb-4 shadow-2xl animate-glow">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Budget Severity Estimator
          </h1>
          <p className="text-muted-foreground text-sm">
            AI-powered Smart Maintenance for Smart Communities
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="role">Select Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as "resident" | "admin" | "worker")}>
              <SelectTrigger className="w-full bg-white/50 backdrop-blur-sm">
                <SelectValue placeholder="Choose your role" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-xl">
                <SelectItem value="resident">Resident</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="worker">Worker</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/50 backdrop-blur-sm"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/50 backdrop-blur-sm"
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            variant="premium"
            className="w-full"
            disabled={!email || !password || !role}
          >
            Login
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Demo login: any email/password with selected role</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
