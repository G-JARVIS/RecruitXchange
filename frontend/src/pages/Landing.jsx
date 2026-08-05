import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, BookOpen, Calendar, Award, Target, BriefcaseIcon, GraduationCap } from "lucide-react";

export default function Landing() {
  const features = [
    {
      title: "Smart Profile Builder",
      description: "AI-powered resume builder and profile optimization",
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Learning Hub",
      description: "Curated courses and skill development paths",
      icon: BookOpen,
      color: "text-accent"
    },
    {
      title: "Drive Management",
      description: "Track and apply to placement drives seamlessly",
      icon: BriefcaseIcon,
      color: "text-success"
    },
    {
      title: "Counseling Sessions",
      description: "1:1 Career guidance and mentorship",
      icon: Target,
      color: "text-warning"
    }
  ];

  const stats = [
    { label: "Active Companies", value: "500+" },
    { label: "Successful Placements", value: "10,000+" },
    { label: "Learning Resources", value: "1,000+" },
    { label: "Career Experts", value: "50+" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  RecruitXchange
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/about" className="text-foreground/60 hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/features" className="text-foreground/60 hover:text-primary transition-colors">
                Features
              </Link>
              <Link to="/signin" className="text-foreground/60 hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-x">
                  Unlock Your Career Potential with AI-Powered Platform
                </h1>
                <p className="text-xl text-foreground/70">
                  Your all-in-one platform for career development, placement preparation, and professional growth.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl" />
              <div className="relative bg-card rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/20 backdrop-blur-sm" />
                <div className="relative p-8">
                  <div className="grid gap-6">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-card/50 to-card/30 border border-border/50 backdrop-blur-sm animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      >
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 bg-gradient-to-r from-primary/20 to-accent/20 rounded" />
                          <div className="h-3 w-1/2 bg-gradient-to-r from-primary/10 to-accent/10 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-b from-background/95 to-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need for Your Career Growth
            </h2>
            <p className="text-lg text-foreground/70">
              Comprehensive tools and resources to help you succeed
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="relative overflow-hidden backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                <div className="relative p-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-foreground/70">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-b from-background to-background/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-card/50 to-card/30 border border-border/50 backdrop-blur-sm"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-b from-background/95 to-background relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            Join thousands of students and professionals who have transformed their careers with RecruitXchange
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background border-t border-border/40">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/features" className="text-sm text-foreground/70 hover:text-primary">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-sm text-foreground/70 hover:text-primary">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-sm text-foreground/70 hover:text-primary">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-sm text-foreground/70 hover:text-primary">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/blog" className="text-sm text-foreground/70 hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/documentation" className="text-sm text-foreground/70 hover:text-primary">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-sm text-foreground/70 hover:text-primary">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-foreground/70 hover:text-primary">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/40">
            <p className="text-center text-sm text-foreground/70">
              © {new Date().getFullYear()} RecruitXchange. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}