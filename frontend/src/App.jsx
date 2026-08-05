// App.jsx
import { Toaster } from "@/components/ui/toaster.jsx";
import { Toaster as Sonner } from "@/components/ui/sonner.jsx";
import { TooltipProvider } from "@/components/ui/tooltip.jsx";
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout.jsx";
import { AuthProvider } from "@/contexts/AuthContext.jsx";
import { ProfileAIProvider } from "@/providers/ProfileAIProvider.jsx";
import ProtectedRoute from "@/components/auth/ProtectedRoute.jsx";
import RoleBasedRoute from "@/components/auth/RoleBasedRoute.jsx";

import Index from "./pages/Index.jsx";
import Profile from "./pages/Profile.jsx";
import RoleExplorerSimple from "./pages/RoleExplorerSimple.jsx";
import LearningHub from "./pages/LearningHub.jsx";
import PracticeHub from "./pages/PracticeHub.jsx";
import Counseling from "./pages/Counseling.jsx";
import CounselingSimple from "./pages/CounselingSimple.jsx";
import MyDrives from "./pages/MyDrives.jsx";
import Calendar from "./pages/Calendar.jsx";
import Settings from "./pages/Settings.jsx";
import NotFound from "./pages/NotFound.jsx";
import Goals from "./pages/Goals.jsx";
import ResumeBuilder from "./pages/ResumeBuilder.jsx";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageStudents from "./pages/admin/ManageStudents.jsx";
import StudentProfile from "./pages/admin/StudentProfile.jsx";
import ManageQuizzes from "./pages/admin/ManageQuizzes.jsx";
import ManageDrives from "./pages/admin/ManageDrives.jsx";
import DriveApplications from "./pages/admin/DriveApplications.jsx";
import ManageCounselling from "./pages/admin/ManageCounselling.jsx";
import ManageRoles from "./pages/admin/ManageRoles.jsx";

const App = () => (
  <AuthProvider>
    <TooltipProvider>
      <ProfileAIProvider>
        <Toaster />
        <Sonner />
        <ProtectedRoute>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Index />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/roles" element={<RoleExplorerSimple />} />
              <Route path="/learning" element={<LearningHub />} />
              <Route path="/practice" element={<PracticeHub />} />
              <Route path="/counseling" element={<CounselingSimple />} />
              <Route path="/drives" element={<MyDrives />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/settings" element={<Settings />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/students"
                element={
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <ManageStudents />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/students/:id"
                element={
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <StudentProfile />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/quizzes"
                element={
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <ManageQuizzes />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/drives"
                element={
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <ManageDrives />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/drives/:driveId/applications"
                element={
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <DriveApplications />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/counselling"
                element={
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <ManageCounselling />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/roles"
                element={
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <ManageRoles />
                  </RoleBasedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </ProtectedRoute>
      </ProfileAIProvider>
    </TooltipProvider>
  </AuthProvider>
);

export default App;
