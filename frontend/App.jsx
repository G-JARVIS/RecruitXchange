import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Landing from "@/pages/Landing";
import SignInSignUp from "@/pages/SignInSignUp";
import Dashboard from "@/components/dashboard/Dashboard";
import Calendar from "@/pages/Calendar";
import Profile from "@/pages/Profile";
import LearningHub from "@/pages/LearningHub";
import PracticeHub from "@/pages/PracticeHub";
import MyDrives from "@/pages/MyDrives";
import RoleExplorer from "@/pages/RoleExplorer";
import Counseling from "@/pages/Counseling";
import Settings from "@/pages/Settings";
import Goals from "@/pages/Goals";
import ResumeBuilder from "@/pages/ResumeBuilder";
import NotFound from "@/pages/NotFound";
import AppLayout from "@/components/layout/AppLayout";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<SignInSignUp />} />

          {/* Protected Routes - Wrapped in AppLayout */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/learning" element={<LearningHub />} />
            <Route path="/practice" element={<PracticeHub />} />
            <Route path="/drives" element={<MyDrives />} />
            <Route path="/roles" element={<RoleExplorer />} />
            <Route path="/counseling" element={<Counseling />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/resume" element={<ResumeBuilder />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}