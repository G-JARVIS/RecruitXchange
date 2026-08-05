import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  BookOpen,
  Code,
  Award,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useTheme } from "@/providers/ThemeProvider.jsx";

export default function RecentActivity({ attempts = [] }) {
  const { palette } = useTheme();

  // Dynamic color mappings based on palette
  const paletteColors = {
    somaiya: {
      primary: "linear-gradient(135deg, #800000, #990000)",
      accent: "linear-gradient(135deg, #990000, #800000)"
    }
  };

  const currentColors = paletteColors[palette] || paletteColors.somaiya;

  // Format real attempts into activity objects, fallback to mock if none
  const activities = attempts.length > 0 
    ? attempts.map(a => ({
        id: a._id,
        type: a.type === 'coding' ? 'practice_session' : 'skill_assessment',
        title: `Attempted: ${a.questionId?.title || 'Question'}`,
        description: a.isCorrect ? 'Passed test cases' : 'Attempted to solve',
        timestamp: new Date(a.submittedAt).toLocaleDateString(),
        points: `+${a.score} XP`
      }))
    : [
        {
          id: 1,
          type: "course_completed",
          title: "Completed React Hooks Mastery",
          description: "Advanced hooks and performance optimization",
          timestamp: "2 hours ago",
          points: "+50 XP",
        },
        {
          id: 2,
          type: "practice_session",
          title: "Solved 5 coding problems",
          description: "Dynamic programming challenges",
          timestamp: "5 hours ago",
          points: "+25 XP",
        },
        {
          id: 3,
          type: "skill_assessment",
          title: "JavaScript Assessment - Passed",
          description: "Scored 92% in advanced concepts",
          timestamp: "1 day ago",
          points: "+100 XP",
        }
      ];

  const getActivityIcon = (type) => {
    const icons = {
      course_completed: CheckCircle,
      practice_session: Code,
      skill_assessment: Award,
      learning_path: BookOpen,
      skill_improvement: TrendingUp,
      application: CheckCircle
    };
    return icons[type] || CheckCircle;
  };

  const getActivityColor = (type) => {
    const colors = {
      course_completed: "success",
      practice_session: "primary", 
      skill_assessment: "accent",
      learning_path: "warning",
      skill_improvement: "primary",
      application: "success"
    };
    return colors[type] || "success";
  };

  // Loading state removed, handled by parent

  return (
    <Card className="bg-gradient-glass border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your learning journey this week</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {activities.reduce((sum, activity) => {
              const points = parseInt(activity.points) || 0;
              return sum + points;
            }, 0)} XP earned
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 5).map((activity) => {
            const IconComponent = getActivityIcon(activity.type);
            const color = getActivityColor(activity.type);
            
            const getColorStyle = (color) => {
              switch (color) {
                case 'primary':
                  return { background: currentColors.primary };
                case 'accent':
                  return { background: currentColors.accent };
                case 'success':
                  return { background: 'hsl(var(--success))' };
                case 'warning':
                  return { background: 'hsl(var(--warning))' };
                default:
                  return { background: currentColors.primary };
              }
            };

            return (
              <div
                key={activity.id || activity._id}
                className="flex items-start gap-4 p-3 rounded-lg bg-gradient-glass border border-border/50 hover:border-primary/30 transition-all duration-200"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
                  style={getColorStyle(color)}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm">{activity.title}</h4>
                    <span className="text-xs font-medium text-primary">
                      {activity.points}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {activity.description}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-border/50">
          <Button variant="outline" className="w-full">
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}