import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, TrendingUp, Shield } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
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
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary-glow/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "3s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-primary-glow to-accent mb-6 shadow-2xl animate-glow">
              <Brain className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6">
              Budget Severity Estimator
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              AI-powered Smart Maintenance for Smart Communities.
              Detect issues, predict costs, and manage maintenance seamlessly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => navigate("/login")}
                size="lg"
                variant="premium"
                className="text-lg px-8 py-6"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 bg-white/60 backdrop-blur-sm hover:bg-white/80 border-2"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="glass-card rounded-t-3xl p-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
              Powered by Advanced AI Technology
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-card p-6 rounded-2xl animate-slide-up hover:scale-[1.05] transition-transform duration-300 border-2 border-primary/10 hover:border-primary/30">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-4 shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Detection</h3>
                <p className="text-muted-foreground">
                  AI analyzes uploaded images to automatically detect issue types and severity levels
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl animate-slide-up hover:scale-[1.05] transition-transform duration-300 border-2 border-accent/10 hover:border-accent/30" style={{ animationDelay: "100ms" }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-amber-500 flex items-center justify-center mb-4 shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Budget Prediction</h3>
                <p className="text-muted-foreground">
                  Machine learning models provide accurate cost estimates for maintenance repairs
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl animate-slide-up hover:scale-[1.05] transition-transform duration-300 border-2 border-success/10 hover:border-success/30" style={{ animationDelay: "200ms" }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success to-emerald-500 flex items-center justify-center mb-4 shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Real-time Management</h3>
                <p className="text-muted-foreground">
                  Track issues from reporting to resolution with live status updates and analytics
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
