import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, ArrowLeft, Mail, Lock, User, Briefcase, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function SignInSignUp() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "student", // or "recruiter"
    company: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignIn) {
        await login(formData.email, formData.password);
        navigate("/dashboard");
      } else {
        await register(formData);
        toast({
          title: "Account created successfully!",
          description: "Please sign in with your credentials.",
        });
        setIsSignIn(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 flex">
      {/* Left Panel - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 p-8 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-3xl" />
        <div className="relative">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              RecruitXchange
            </span>
          </Link>

          <div className="mt-20 space-y-8">
            <h1 className="text-4xl font-bold">
              Welcome to the Future of Career Development
            </h1>
            <p className="text-lg text-foreground/70">
              Join our platform to unlock your career potential with AI-powered tools,
              expert guidance, and exclusive opportunities.
            </p>

            <div className="grid gap-6">
              {[
                {
                  title: "Smart Profile Builder",
                  description: "Create an impressive profile with AI assistance",
                  icon: User,
                },
                {
                  title: "Placement Drives",
                  description: "Access exclusive job opportunities",
                  icon: Briefcase,
                },
                {
                  title: "Learning Resources",
                  description: "Enhance your skills with curated content",
                  icon: GraduationCap,
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-card/50 to-card/30 border border-border/50 backdrop-blur-sm"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-foreground/70">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative text-sm text-foreground/70">
          © {new Date().getFullYear()} RecruitXchange. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md p-8 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">
                {isSignIn ? "Welcome Back!" : "Create Your Account"}
              </h2>
              <p className="text-foreground/70">
                {isSignIn
                  ? "Sign in to continue to your dashboard"
                  : "Join us to start your career journey"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isSignIn && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        className="pl-9"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>I am a</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="button"
                        variant={formData.role === "student" ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setFormData(prev => ({ ...prev, role: "student" }))}
                      >
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Student
                      </Button>
                      <Button
                        type="button"
                        variant={formData.role === "recruiter" ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setFormData(prev => ({ ...prev, role: "recruiter" }))}
                      >
                        <Building2 className="w-4 h-4 mr-2" />
                        Recruiter
                      </Button>
                    </div>
                  </div>

                  {formData.role === "recruiter" && (
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                        <Input
                          id="company"
                          name="company"
                          placeholder="Company Name"
                          className="pl-9"
                          value={formData.company}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-9"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : isSignIn ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <div className="text-sm text-foreground/70">
                {isSignIn ? "Don't have an account?" : "Already have an account?"}
              </div>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setIsSignIn(!isSignIn)}
              >
                {isSignIn ? "Create Account" : "Sign In"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}