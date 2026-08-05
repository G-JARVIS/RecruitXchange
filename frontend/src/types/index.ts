// ============================================================
// RecruitXchange — Global TypeScript Type Definitions
// ============================================================

// ─── User & Auth ─────────────────────────────────────────────────────────────
export type UserRole = 'student' | 'admin' | 'recruiter';
export type UserStatus = 'active' | 'pending_approval' | 'suspended';
export type AuthProvider = 'local' | 'google';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  googleId?: string;
  authProvider: AuthProvider;
  lastLogin?: string;
  createdAt?: string;
  onboardingComplete?: boolean;
  profile?: StudentProfile;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

// ─── Student Profile ─────────────────────────────────────────────────────────
export interface Experience {
  company: string;
  role: string;
  duration: string;
  description?: string;
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
  cgpa?: number;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
  leetcode?: string;
  codechef?: string;
  hackerrank?: string;
}

export type Department =
  | 'Computer Engineering'
  | 'Information Technology'
  | 'Data Science & Algorithms'
  | 'Electronics & Telecommunication'
  | 'Mechanical Engineering'
  | 'Civil Engineering'
  | 'Electrical Engineering'
  | 'AI & Machine Learning'
  | 'Other';

export type YearOfStudy = '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Alumni';

export interface StudentProfile {
  _id: string;
  userId: string;
  rollNumber?: string;
  phone?: string;
  college: string;
  department: Department;
  yearOfStudy: YearOfStudy;
  cgpa: number;
  activeBacklogs: number;
  education: Education[];
  skills: string[];
  interests: string[];
  experience: Experience[];
  socialLinks: SocialLinks;
  resumeUrl?: string;
  resumePublicId?: string;
  atsScore?: number;
  atsKeywords: string[];
  readinessScore: number;
  level: number;
  xp: number;
  badges: string[];
  isVerified: boolean;
  verifiedAt?: string;
  onboardingComplete: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Drive ───────────────────────────────────────────────────────────────────
export type DriveDomain =
  | 'Software Development'
  | 'Data Science'
  | 'DevOps'
  | 'QA Testing'
  | 'Product Management'
  | 'UI/UX Design'
  | 'Business Analyst'
  | 'Other';

export type WorkMode = 'on-site' | 'remote' | 'hybrid';
export type JobType = 'full-time' | 'internship' | 'part-time';
export type DriveApprovalStatus = 'draft' | 'pending_admin_approval' | 'published' | 'rejected' | 'closed';

export interface DriveRound {
  name: string;
  type: 'aptitude' | 'coding' | 'technical' | 'hr' | 'group_discussion' | 'other';
  duration?: string;
  description?: string;
}

export interface Drive {
  _id: string;
  id?: string;
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  companyDescription?: string;
  role: string;
  domain: DriveDomain;
  package: string;
  location: string;
  workMode: WorkMode;
  jobType: JobType;
  minCgpa: number;
  allowedBranches: string[];
  maxBacklogs: number;
  allowedYears: string[];
  skills: string[];
  description: string;
  rounds: DriveRound[];
  deadline: string;
  driveDate?: string;
  venue?: string;
  approvalStatus: DriveApprovalStatus;
  interestCount: number;
  applicationCount: number;
  userStatus?: ApplicationStatus | null;
  createdAt: string;
}

// ─── Application ─────────────────────────────────────────────────────────────
export type ApplicationStatus =
  | 'interested'
  | 'applied'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'offered'
  | 'rejected';

export interface Application {
  _id: string;
  driveId: string | Drive;
  studentId: string | User;
  status: ApplicationStatus;
  expressedInterestAt?: string;
  bookmarked: boolean;
  appliedAt?: string;
  interviewDate?: string;
  interviewLink?: string;
  offerLetterUrl?: string;
  createdAt: string;
}

// ─── Practice Questions ───────────────────────────────────────────────────────
export type QuestionType = 'mcq' | 'coding' | 'aptitude';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface MCQOption {
  label: string;
  text: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Question {
  _id: string;
  title: string;
  description: string;
  type: QuestionType;
  difficulty: Difficulty;
  tags: string[];
  company: string[];
  options?: MCQOption[];
  explanation?: string;
  starterCode?: string;
  testCases?: TestCase[];
  languagesAllowed?: string[];
  hint?: string;
  totalAttempts: number;
  correctRate: number;
  createdAt: string;
}

export interface Attempt {
  _id: string;
  studentId: string;
  questionId: string | Question;
  type: QuestionType;
  answer?: string;
  code?: string;
  language?: string;
  isCorrect: boolean;
  score: number;
  timeTaken: number;
  testCasesPassed?: number;
  totalTestCases?: number;
  executionOutput?: string;
  errorOutput?: string;
  hintsUsed: number;
  solutionViewed: boolean;
  submittedAt: string;
}

// ─── Practice Test (legacy compat) ───────────────────────────────────────────
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

// ─── Learning ─────────────────────────────────────────────────────────────────
export type LearningDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface LearningPath {
  _id: string;
  title: string;
  description: string;
  targetRole: string;
  domain: string;
  estimatedHours: number;
  difficulty: LearningDifficulty;
  tags: string[];
  thumbnail?: string;
  modules: LearningModule[];
  prerequisites: string[];
  learningOutcomes: string[];
  isPublished: boolean;
  enrollmentCount: number;
  rating: number;
  createdAt: string;
}

export interface LearningModule {
  lessonId: string | Lesson;
  order: number;
  isOptional: boolean;
}

export interface CodeSnippet {
  language: string;
  code: string;
  description?: string;
}

export interface ExternalResource {
  title: string;
  url: string;
  source: string;
  type: 'article' | 'video' | 'exercise' | 'documentation';
}

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  content: string;
  codeSnippets: CodeSnippet[];
  externalResources: ExternalResource[];
  duration: number;
  difficulty: LearningDifficulty;
  tags: string[];
  pathId?: string;
  order?: number;
  thumbnail?: string;
  quizQuestions: Question[];
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
}

// ─── Counseling ───────────────────────────────────────────────────────────────
export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
}

export type CounselingStatus = 'pending' | 'accepted' | 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';

export interface CounselingSession {
  _id: string;
  studentId: string | User;
  counselorId?: string | User;
  topic: string;
  description?: string;
  type: '1:1' | 'group';
  preferredSlots: TimeSlot[];
  scheduledSlot?: TimeSlot;
  meetingLink?: string;
  status: CounselingStatus;
  adminNote?: string;
  studentNote?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────
export type NotificationType =
  | 'drive_published'
  | 'drive_deadline'
  | 'interest_acknowledged'
  | 'application_status'
  | 'counseling_confirmed'
  | 'counseling_rescheduled'
  | 'lesson_completed'
  | 'badge_earned'
  | 'readiness_milestone'
  | 'admin_message'
  | 'system';

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedId?: string;
  relatedType?: 'drive' | 'lesson' | 'question' | 'counseling' | 'application';
  actionUrl?: string;
  icon?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  readAt?: string;
}

// ─── Predictor ────────────────────────────────────────────────────────────────
export interface WeakTopic {
  topic: string;
  currentScore: number;
  targetScore: number;
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
}

export interface PredictorResult {
  readinessScore: number;
  confidence: number;
  breakdown: {
    cgpa: number;
    atsScore: number;
    skills: number;
    socialLinks: number;
    profileComplete: number;
  };
  weakTopics: WeakTopic[];
  topStrengths: string[];
  recommendations: string[];
}

// ─── API Responses ────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ─── Theme ────────────────────────────────────────────────────────────────────
export type Theme = 'light' | 'dark';

export interface AccentPalette {
  id: string;
  name: string;
  description: string;
  primary: string;
  primaryHsl: string;
  accent: string;
  accentHsl: string;
  gradient: string;
  glow: string;
  preview: string;
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
export interface DashboardStats {
  readinessScore: number;
  totalAttempts: number;
  passRate: number;
  level: number;
  xp: number;
  badges: string[];
  onboardingComplete: boolean;
}

export interface AdminDashboardStats {
  totalStudents: number;
  verifiedStudents: number;
  pendingCounseling: number;
  totalDrives: number;
  publishedDrives: number;
  pendingDrives: number;
  totalApplications: number;
  totalQuestions: number;
  pendingQuestions: number;
}

// ─── Mastery Radar ────────────────────────────────────────────────────────────
export interface RadarData {
  category: string;
  score: number;
  total: number;
}

// ─── Company (legacy compat) ──────────────────────────────────────────────────
export interface Company {
  id: string;
  recruiterId: string;
  companyName: string;
  website: string;
  isApprovedByAdmin: boolean;
}
