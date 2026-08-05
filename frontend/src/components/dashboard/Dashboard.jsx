import { useState, useEffect } from "react";
import { TrendingUp, BookOpen, Code, Users, Calendar, Award, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import ReadinessGauge from "./ReadinessGauge.jsx";
import RecentActivity from "./RecentActivity.jsx";
import UpcomingEvents from "./UpcomingEvents.jsx";
import QuickActions from "./QuickActions.jsx";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useTheme } from "@/providers/ThemeProvider.jsx";
import { studentService } from "@/services/studentService.ts";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, getAuthHeaders, API_BASE_URL } = useAuth();
  const { palette } = useTheme();

  // Dynamic color mappings based on palette
  const paletteColors = {
    somaiya: {
      primary: "#800000",
      accent: "#990000",
      gradient: "linear-gradient(135deg, #800000 0%, #990000 55%, #b91c1c 100%)",
      cardGradient: "linear-gradient(135deg, #800000, #990000)"
    }
  };

  const currentColors = paletteColors[palette] || paletteColors.somaiya;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await studentService.getDashboardStats();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { stats, profile, recentAttempts } = dashboardData || {};

  const learning = {
    completedCourses: stats?.totalAttempts || 0,
    totalXp: stats?.xp || 0,
    level: stats?.level || 1,
  };

  const readiness = {
    score: stats?.readinessScore || 0,
    level: stats?.level || 1,
  };

  const applications = {
    applied: 0,
    total: 5,
    interviews: 0,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div 
        className="relative overflow-hidden rounded-2xl p-8 text-white"
        style={{ background: currentColors.gradient }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full animate-pulse" />
        <div className="relative">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Student'}! 👋</h1>
          <p className="text-lg text-white/90 mb-6">
            Ready to take your career to the next level? Let's explore what's new today.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="glass"
              className="text-white border-white/20 hover:bg-white/20"
              onClick={() => window.location.href = '/goals'}
            >
              <Target className="w-4 h-4" />
              View Goals
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Calendar className="w-4 h-4" />
              Schedule Learning
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-glass border-primary/20 hover:shadow-primary/10 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Skill Score
                </p>
                <p className="text-2xl font-bold text-primary">{readiness.score}%</p>
                <p className="text-xs text-success">↗ +5% this week</p>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-primary/20 shadow-lg"
                style={{ background: currentColors.cardGradient }}
              >
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-glass border-accent/20 hover:shadow-accent/10 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Courses Completed
                </p>
                <p className="text-2xl font-bold text-accent">{learning.completedCourses}</p>
                <p className="text-xs text-success">↗ +3 this month</p>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-accent/20 shadow-lg"
                style={{ background: `linear-gradient(135deg, ${currentColors.accent}, ${currentColors.primary})` }}
              >
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-glass border-success/20 hover:shadow-success/10 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Applications Sent
                </p>
                <p className="text-2xl font-bold text-success">{applications.applied}</p>
                <p className="text-xs text-success">↗ +2 this week</p>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{ 
                  background: 'hsl(var(--success))' 
                }}
              >
                <Code className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-glass border-warning/20 hover:shadow-warning/10 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Drives
                </p>
                <p className="text-2xl font-bold text-warning">{applications.total}</p>
                <p className="text-xs text-muted-foreground">{applications.interviews} interviews</p>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{ 
                  background: 'hsl(var(--warning))' 
                }}
              >
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ReadinessGauge score={readiness.score} level={readiness.level} />
        </div>
        <div className="lg:col-span-2">
          <QuickActions profile={profile} />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity attempts={recentAttempts || []} />
        <UpcomingEvents />
      </div>

      {/* Recommended Learning Path */}
      <Card className="bg-gradient-glass border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Recommended for You
              </CardTitle>
              <CardDescription>Based on your goals and current skill level</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              AI Powered
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-glass rounded-xl border border-primary/10">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center shadow-primary/20 shadow-lg"
                  style={{ background: currentColors.cardGradient }}
                >
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Advanced React Patterns</h4>
                  <p className="text-sm text-muted-foreground">Master advanced concepts and hooks</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={35} className="w-20 h-2" />
                    <span className="text-xs text-muted-foreground">35% complete</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="gradient" 
                size="sm"
                style={{ background: currentColors.cardGradient }}
              >
                Continue
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-glass rounded-xl border border-accent/10">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center shadow-accent/20 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${currentColors.accent}, ${currentColors.primary})` }}
                >
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">System Design Fundamentals</h4>
                  <p className="text-sm text-muted-foreground">Learn to design scalable systems</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">New</Badge>
                    <span className="text-xs text-muted-foreground">8 hours</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                Start
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}