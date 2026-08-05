import type { Application, Company, Drive, PracticeTest, StudentProfile, User } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'u-student-001',
    name: 'Aarav Kulkarni',
    email: 'aarav.kulkarni@somaiya.edu',
    role: 'student',
    status: 'active',
  },
  {
    id: 'u-recruiter-001',
    name: 'Rhea Mehta',
    email: 'rhea.mehta@innoventatech.com',
    role: 'recruiter',
    status: 'pending_approval',
  },
  {
    id: 'u-admin-001',
    name: 'Dr. S. Patwardhan',
    email: 'tpo.office@somaiya.edu',
    role: 'admin',
    status: 'active',
  },
];

export const mockStudentProfile: StudentProfile = {
  userId: 'u-student-001',
  rollNumber: 'BTECH-CS-2026-041',
  department: 'Computer Engineering',
  cgpa: 8.6,
  backlogs: 0,
  skills: ['React', 'Node.js', 'Python', 'Tailwind'],
  isVerified: true,
  resumeUrl: 'https://cdn.recruitxchange.dev/resumes/aarav-kulkarni.pdf',
};

export const mockCompany: Company = {
  id: 'c-001',
  recruiterId: 'u-recruiter-001',
  companyName: 'Innoventa Technologies',
  website: 'https://innoventatech.com',
  isApprovedByAdmin: false,
};

export const mockDrives: Drive[] = [
  {
    id: 'd-001',
    companyId: 'c-101',
    companyName: 'Tata Consultancy Services',
    role: 'Graduate Engineer Trainee',
    package: 720000,
    minCgpa: 7,
    allowedBranches: ['Computer Engineering', 'Information Technology', 'Data Science'],
    maxBacklogs: 0,
    approvalStatus: 'published',
    deadline: '2026-09-05T23:59:59.000Z',
  },
  {
    id: 'd-002',
    companyId: 'c-102',
    companyName: 'L&T Technology Services',
    role: 'Software Engineer - Campus',
    package: 1050000,
    minCgpa: 7.5,
    allowedBranches: ['Computer Engineering', 'Electronics', 'Data Science'],
    maxBacklogs: 0,
    approvalStatus: 'published',
    deadline: '2026-09-12T23:59:59.000Z',
  },
  {
    id: 'd-003',
    companyId: 'c-001',
    companyName: 'Innoventa Technologies',
    role: 'Full Stack Developer Intern + PPO',
    package: 900000,
    minCgpa: 8,
    allowedBranches: ['Computer Engineering', 'Data Science'],
    maxBacklogs: 0,
    approvalStatus: 'pending_admin_approval',
    deadline: '2026-09-18T23:59:59.000Z',
  },
  {
    id: 'd-004',
    companyId: 'c-001',
    companyName: 'Innoventa Technologies',
    role: 'Frontend Engineer (Draft)',
    package: 800000,
    minCgpa: 7,
    allowedBranches: ['Computer Engineering', 'Information Technology'],
    maxBacklogs: 1,
    approvalStatus: 'draft',
    deadline: '2026-10-01T23:59:59.000Z',
  },
];

export const mockApplications: Application[] = [
  {
    id: 'a-001',
    driveId: 'd-001',
    studentId: 'u-student-001',
    status: 'applied',
    appliedAt: '2026-08-02T10:15:00.000Z',
  },
];

export const mockPracticeTests: PracticeTest[] = [
  {
    id: 'pt-001',
    title: 'Campus Aptitude Sprint - Set A',
    category: 'Aptitude',
    durationMinutes: 30,
    questions: [
      {
        question: 'Quantitative: If a number is increased by 20% and becomes 360, what is the original number?',
        options: ['250', '280', '300', '320'],
        correctIndex: 2,
      },
      {
        question: 'Logical: Find the next term in the series: 2, 6, 12, 20, 30, ?',
        options: ['36', '40', '42', '44'],
        correctIndex: 2,
      },
      {
        question: 'Verbal: Choose the correct synonym of "meticulous".',
        options: ['Careless', 'Precise', 'Lazy', 'Unaware'],
        correctIndex: 1,
      },
      {
        question: 'Quantitative: A train 120 m long crosses a pole in 6 seconds. Its speed is:',
        options: ['20 m/s', '18 m/s', '15 m/s', '12 m/s'],
        correctIndex: 0,
      },
      {
        question: 'Logical: In a code, PLACEMENT is written as QMBDFNFOU. How is PORTAL written?',
        options: ['QPSUBM', 'QNRSBM', 'QPRUBM', 'QPSVBN'],
        correctIndex: 0,
      },
    ],
  },
];

export const getPublishedDrivesForStudents = () =>
  mockDrives.filter((drive) => drive.approvalStatus === 'published');
