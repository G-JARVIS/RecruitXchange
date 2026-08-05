import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Bookmark, Clock, MapPin, Users, Calendar, Star, Search, Filter, Building2, ArrowRight, Sparkles, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { toast } from "sonner";
import ApplicationStatusModal from "@/components/applications/ApplicationStatusModal.jsx";
import DriveInfoModal from "@/components/drives/DriveInfoModal.jsx";
import { driveService } from "@/services/driveService.ts";
import { useTheme } from "@/providers/ThemeProvider.jsx";

export default function MyDrives() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedDriveId, setSelectedDriveId] = useState(null);
  
  const { user } = useAuth();
  const { palette } = useTheme();
  const paletteColors = {
    somaiya: { primary: "#800000", accent: "#990000" }
  };
  const currentColors = paletteColors[palette] || paletteColors.somaiya;

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const response = await driveService.getDrives({ limit: 50 });
      if (response.success) {
        setDrives(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch drives:', error);
      toast.error("Failed to load company drives");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (driveId) => {
    try {
      const response = await driveService.expressInterest(driveId);
      if (response.success) {
        toast.success("Interest Registered successfully");
        await fetchDrives(); // refresh list to update userStatus
      } else {
        toast.error(response.message || "Failed to express interest");
      }
    } catch (error) {
      console.error('Apply error:', error);
      toast.error("Failed to submit interest");
    }
  };

  const handleBookmark = async (driveId) => {
    try {
      const response = await driveService.toggleBookmark(driveId);
      if (response.success) {
        toast.success(response.message);
        await fetchDrives(); // refresh list to update bookmark state
      }
    } catch (error) {
      toast.error("Failed to bookmark drive");
    }
  }

  const filteredDrives = drives.filter(drive => {
    // Map backend userStatus to tab filters
    const status = drive.userStatus || "eligible"; 
    const matchesTab = activeTab === "all" || status === activeTab;
    const matchesSearch =
      drive.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.role?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const styles = {
      interested: "bg-primary/10 text-primary border-primary/20",
      applied: "bg-primary/10 text-primary border-primary/20",
      bookmarked: "bg-warning/10 text-warning border-warning/20",
      eligible: "bg-success/10 text-success border-success/20",
      rejected: "bg-destructive/10 text-destructive border-destructive/20",
      shortlisted: "bg-accent/10 text-accent border-accent/20",
      interview: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      selected: "bg-green-500/10 text-green-500 border-green-500/20"
    };
    return styles[status] || styles.eligible; // default to eligible visually
  };

  const tabs = [
    { id: "all", label: "All Drives", count: drives.length },
    { id: "interested", label: "Interested", count: drives.filter(d => d.userStatus === "interested" || d.userStatus === "applied").length },
    { id: "eligible", label: "Eligible", count: drives.filter(d => !d.userStatus).length },
  ];

  const handleViewStatus = (drive) => {
    // Assuming backend will populate app ID, if not just show info modal
    setSelectedApplicationId(drive._id);
    setStatusModalOpen(true);
  };

  const handleViewInfo = (driveId) => {
    setSelectedDriveId(driveId);
    setInfoModalOpen(true);
  };

  const getActionButton = (drive) => {
    const status = drive.userStatus;
    
    if (!status) { // null or eligible
      return (
        <Button 
          style={{ background: currentColors.primary }}
          className="text-white"
          size="sm"
          onClick={() => handleApply(drive._id)}
        >
          Express Interest
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      );
    }
    
    switch (status) {
      case "interested":
      case "applied":
      case "shortlisted":
      case "interview":
      case "selected":
        return (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleViewStatus(drive)}
          >
            View Status
          </Button>
        );
      case "rejected":
        return (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleViewStatus(drive)}
            className="text-destructive hover:text-destructive"
          >
            View Details
          </Button>
        );
      default:
        return null;
    }
  };

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
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">My Placement Drives</h1>
              <p className="text-lg text-white/90 mt-1">
                Track applications • Discover opportunities • Land your dream job
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
                  placeholder="Search companies or roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-14 bg-white/10 backdrop-blur-xl border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 rounded-2xl text-base"
                />
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="lg"
              className="h-14 px-6 bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 rounded-2xl"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Premium Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Users, value: drives.filter(d => d.userStatus === "interested").length, label: "Interested", gradient: "from-primary to-primary/80" },
          { icon: Clock, value: drives.filter(d => ["shortlisted", "interview"].includes(d.userStatus)).length, label: "In Progress", gradient: "from-success to-success/80" },
          { icon: Star, value: "85%", label: "Avg Profile Match", gradient: "from-accent to-accent/80" },
        ].map((stat, index) => (
          <Card 
            key={index}
            className="group bg-gradient-glass border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10"
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? "text-white shadow-lg" : ""}
            style={activeTab === tab.id ? { background: currentColors.primary } : {}}
          >
            {tab.label}
            <Badge variant="secondary" className="ml-2 text-xs bg-muted">
              {tab.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Drives List */}
      <div className="space-y-4">
        {filteredDrives.length === 0 ? (
          <Card className="bg-gradient-glass border-border/50">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No drives found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? `No results for "${searchQuery}"` : "No drives match your current filter"}
              </p>
              <Button style={{ background: currentColors.primary }} className="text-white">
                <Sparkles className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredDrives.map((drive, index) => (
            <motion.div
              key={drive._id}
              layout
              initial={{ opacity: 0, y: 18, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.985 }}
              transition={{ duration: 0.32, delay: index * 0.04, ease: "easeOut" }}
            >
            <Card
              className="group bg-gradient-glass border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardContent className="p-7 relative">
                <div className="flex items-start gap-6">
                  {/* Company Logo */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-card to-muted/50 flex items-center justify-center text-4xl border border-border/50 shadow-lg">
                      {drive.companyLogo ? (
                         <img src={drive.companyLogo} alt={drive.companyName} className="rounded-2xl object-cover" />
                      ) : (
                         <span className="font-bold text-2xl">{drive.companyName?.[0]}</span>
                      )}
                    </div>
                  </div>

                  {/* Drive Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                            {drive.companyName}
                          </h3>
                          {/* <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 shadow-lg">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Featured
                          </Badge> */}
                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.22, delay: 0.1 + index * 0.03 }}
                          >
                            <Badge variant="outline" className={getStatusBadge(drive.userStatus || "eligible")}>
                              {drive.userStatus || "eligible"}
                            </Badge>
                          </motion.div>
                        </div>
                        <h4 className="text-lg font-semibold mb-4 text-muted-foreground">
                          {drive.role} • {drive.domain}
                        </h4>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-muted/30 rounded-xl">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Location
                        </p>
                        <p className="text-sm font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {drive.location || "Remote / Onsite"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Package
                        </p>
                        <p className="text-sm font-bold text-primary flex items-center gap-1">
                          {drive.ctc ? `₹${drive.ctc} LPA` : "Not Disclosed"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Deadline
                        </p>
                        <p className="text-sm font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(drive.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Application Progress */}
                    {["interested", "applied", "shortlisted"].includes(drive.userStatus) && (
                      <div className="p-4 mb-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold mb-1">
                              Current Stage: <span className="text-primary capitalize">{drive.userStatus}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Track your progress carefully
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Rejected Application Status */}
                    {drive.userStatus === "rejected" && (
                      <div className="p-4 mb-4 rounded-xl bg-gradient-to-r from-destructive/10 to-red-100/10 border border-destructive/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold mb-1 text-destructive">
                              Application Rejected
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Keep trying and enhancing your skills.
                            </p>
                          </div>
                          <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                            Rejected
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Requirements & Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {drive.allowedBranches?.map((req) => (
                          <Badge 
                            key={req} 
                            variant="outline" 
                            className="text-xs px-2 py-1 bg-muted/20"
                          >
                            {req}
                          </Badge>
                        ))}
                        <Badge variant="outline" className="text-xs px-2 py-1 bg-muted/20">
                          <Users className="w-3 h-3 mr-1" />
                          {drive.interestCount || 0} interested
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewInfo(drive._id)}
                          className="hover:bg-primary/10"
                        >
                          <Info className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleBookmark(drive._id)}
                        >
                          <Bookmark className="w-4 h-4" />
                        </Button>
                        {getActionButton(drive)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          ))}
          </AnimatePresence>
        )}
      </div>

      {/* Application Status Modal */}
      <ApplicationStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        applicationId={selectedApplicationId}
      />

      {/* Drive Info Modal */}
      <DriveInfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        driveId={selectedDriveId}
      />
    </div>
  );
}