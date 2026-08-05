export type UserRole = 'student' | 'recruiter' | 'admin';

export type UserStatus = 'pending_approval' | 'active' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface StudentProfile {
  userId: string;
  rollNumber: string;
  department: 'Computer Engineering' | 'Data Science' | 'Information Technology' | string;
  cgpa: number;
  backlogs: number;
  skills: string[];
  isVerified: boolean;
  resumeUrl: string;
}

export interface Company {
  id: string;
  recruiterId: string;
  companyName: string;
  website: string;
  isApprovedByAdmin: boolean;
}

export type DriveApprovalStatus = 'draft' | 'pending_admin_approval' | 'published' | 'rejected';

export interface Drive {
  id: string;
  companyId: string;
  companyName: string;
  role: string;
  package: number;
  minCgpa: number;
  allowedBranches: string[];
  maxBacklogs: number;
  approvalStatus: DriveApprovalStatus;
  deadline: string;
}

export type ApplicationStatus =
  | 'applied'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'offered'
  | 'rejected';

export interface Application {
  id: string;
  driveId: string;
  studentId: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface PracticeQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface PracticeTest {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  questions: PracticeQuestion[];
}
