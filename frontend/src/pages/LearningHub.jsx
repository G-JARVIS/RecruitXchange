import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { Search, BookOpen, Play, Clock, Star, Users, Award, TrendingUp, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { learningService } from "@/services/learningService.ts";
import { toast } from "sonner";
import { useTheme } from "@/providers/ThemeProvider.jsx";

export default function LearningHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [paths, setPaths] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const { palette } = useTheme();

  // Dynamic color mappings based on palette
  const paletteColors = {
    somaiya: {
      primary: "#800000",
      accent: "#990000",
    }
  };
  const currentColors = paletteColors[palette] || paletteColors.somaiya;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const pathsRes = await learningService.getPaths();
      if (pathsRes.success) {
        setPaths(pathsRes.data);
      }
      
      // MOCK: Replace with actual progress endpoint when ready
      setUserProgress([]); 
    } catch (error) {
      console.error('Failed to fetch learning paths:', error);
      toast.error("Failed to load learning paths");
    } finally {
      setLoading(false);
    }
  };

  const getCourseProgress = (courseId) => {
    const progress = userProgress.find(p => p.courseId === courseId);
    return progress || { progress: 0, completed: false };
  };

  const filteredPaths = paths.filter(path =>
    path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    path.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    path.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getLevelColor = (level) => {
    const colors = {
      beginner: "bg-success/10 text-success border-success/20",
      intermediate: "bg-warning/10 text-warning border-warning/20",
      advanced: "bg-destructive/10 text-destructive border-destructive/20",
    };
    return colors[level.toLowerCase()] || "";
  };

  const inProgressCourses = paths.filter(course => {
    const progress = getCourseProgress(course._id);
    return progress.progress > 0 && !progress.completed;
  });

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-3xl p-10 text-white shadow-2xl" style={{ background: `linear-gradient(135deg, ${currentColors.primary}, ${currentColors.accent})` }}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Learning Hub</h1>
              <p className="text-lg text-white/90 mt-1">
                Master in-demand skills • Expert instructors • Lifetime access
              </p>
            </div>
          </div>

          {/* Enhanced Search */}
          <div className="flex gap-3 max-w-3xl mt-6">
            <div className="relative flex-1 group">
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-white/70 z-10" />
                <Input
                  placeholder="Search paths, domains, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-14 bg-white/10 backdrop-blur-xl border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 rounded-2xl text-base"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, value: `${paths.length}+`, label: "Learning Paths", gradient: "from-primary to-primary/80" },
          { icon: Users, value: paths.reduce((sum, p) => sum + p.enrollmentCount, 0), label: "Enrolled", gradient: "from-success to-success/80" },
          { icon: Award, value: `${userProgress.filter(p => p.completed).length}`, label: "Completed", gradient: "from-accent to-accent/80" },
          { icon: Star, value: "4.8", label: "Avg Rating", gradient: "from-warning to-warning/80" },
        ].map((stat, index) => (
          <Card 
            key={index}
            className="group bg-gradient-glass border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10"
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* All Learning Paths */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{filteredPaths.length} Learning Paths Available</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery ? `Filtered by "${searchQuery}"` : "Explore our complete catalog"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map((path, index) => {
            const progress = getCourseProgress(path._id);
            return (
              <Card 
                key={path._id} 
                className="group bg-gradient-glass border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden flex flex-col"
                style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardContent className="p-6 space-y-4 relative flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="text-5xl transition-transform duration-500 group-hover:scale-110 h-16 w-16 bg-muted rounded-xl flex items-center justify-center">
                      {path.thumbnail ? <img src={path.thumbnail} alt={path.title} className="rounded-xl object-cover" /> : <BookOpen className="w-8 h-8 text-primary" />}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge variant="outline" className={getLevelColor(path.difficulty) + " capitalize"}>
                        {path.difficulty}
                      </Badge>
                      {progress.progress > 0 && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {progress.progress}% Done
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors leading-tight">
                      {path.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <span className="font-medium">{path.domain}</span>
                      <span className="text-muted-foreground/50">•</span>
                      <span>Target: {path.targetRole}</span>
                    </p>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {path.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pb-3 border-b border-border/50 mt-auto">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-medium">{path.estimatedHours}h</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                      <span className="font-medium">{path.rating}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span className="font-medium">{path.enrollmentCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span className="font-medium">{path.modules?.length || 0} modules</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {path.tags.slice(0, 4).map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="text-xs px-2 py-0.5 bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {path.tags.length > 4 && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5 bg-muted/30">
                        +{path.tags.length - 4}
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="default"
                      className="flex-1"
                      style={{ background: currentColors.primary }}
                      size="sm"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      {progress.progress > 0 ? 'Continue' : 'Start Path'}
                    </Button>
                    <Button variant="outline" size="sm" className="hover:bg-primary/5">
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}