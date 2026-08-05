/**
 * RecruitXchange — Seed Data Script
 * Run: npm run seed
 * Seeds realistic data for development/testing
 */
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User';
import StudentProfile from '../src/models/StudentProfile';
import Drive from '../src/models/Drive';
import Question from '../src/models/Question';
import LearningPath from '../src/models/LearningPath';
import Lesson from '../src/models/Lesson';
import Notification from '../src/models/Notification';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/recruitxchange';

const seed = async () => {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected\n');

  // ─── Clear existing data ──────────────────────────────────────────────────
  console.log('🗑️  Clearing old seed data...');
  await Promise.all([
    User.deleteMany({ email: /seeduser|admin@recruitxchange/ }),
    Drive.deleteMany({ companyName: /TechCorp|DataVision|CloudSolutions|FinTech|CyberSec/ }),
    Question.deleteMany({ tags: 'seed' }),
    LearningPath.deleteMany({ tags: 'seed' }),
    Lesson.deleteMany({ tags: 'seed' }),
  ]);

  // ─── Admin User ───────────────────────────────────────────────────────────
  console.log('👤 Creating admin user...');
  const adminUser = await User.create({
    name: 'Placement Officer (TPO)',
    email: 'admin@recruitxchange.edu',
    password: 'Admin@1234',
    role: 'admin',
    status: 'active',
    authProvider: 'local',
  });

  // ─── Students ─────────────────────────────────────────────────────────────
  console.log('🎓 Creating student users...');
  const studentData = [
    {
      name: 'Priya Sharma',
      email: 'priya.seeduser@kjsce.edu',
      cgpa: 8.7,
      department: 'Computer Engineering',
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB', 'Data Structures'],
      yearOfStudy: '4th Year',
      rollNumber: 'CE2021001',
    },
    {
      name: 'Rahul Gupta',
      email: 'rahul.seeduser@kjsce.edu',
      cgpa: 7.4,
      department: 'Information Technology',
      skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
      yearOfStudy: '3rd Year',
      rollNumber: 'IT2022042',
    },
    {
      name: 'Anjali Verma',
      email: 'anjali.seeduser@kjsce.edu',
      cgpa: 9.1,
      department: 'Data Science & Algorithms',
      skills: ['Python', 'R', 'Machine Learning', 'Deep Learning', 'SQL', 'Tableau'],
      yearOfStudy: '4th Year',
      rollNumber: 'DSA2021015',
    },
    {
      name: 'Arjun Mehta',
      email: 'arjun.seeduser@kjsce.edu',
      cgpa: 6.8,
      department: 'Computer Engineering',
      skills: ['Java', 'Spring Boot', 'MySQL', 'Git'],
      yearOfStudy: '3rd Year',
      rollNumber: 'CE2022089',
    },
    {
      name: 'Sneha Patel',
      email: 'sneha.seeduser@kjsce.edu',
      cgpa: 8.2,
      department: 'Electronics & Telecommunication',
      skills: ['C', 'C++', 'Embedded Systems', 'Python'],
      yearOfStudy: '4th Year',
      rollNumber: 'ET2021033',
    },
  ];

  for (const s of studentData) {
    const user = await User.create({
      name: s.name,
      email: s.email,
      password: 'Student@1234',
      role: 'student',
      status: 'active',
      authProvider: 'local',
    });

    await StudentProfile.create({
      userId: user._id,
      rollNumber: s.rollNumber,
      phone: `+91 9${Math.floor(Math.random() * 900000000 + 100000000)}`,
      college: 'K.J. Somaiya College of Engineering',
      department: s.department,
      yearOfStudy: s.yearOfStudy,
      cgpa: s.cgpa,
      activeBacklogs: s.cgpa < 7 ? 1 : 0,
      skills: s.skills,
      interests: ['Competitive Programming', 'Open Source', 'Startups'],
      socialLinks: {
        github: `https://github.com/${s.name.toLowerCase().replace(' ', '')}`,
        linkedin: `https://linkedin.com/in/${s.name.toLowerCase().replace(' ', '')}`,
      },
      atsScore: Math.floor(s.cgpa * 8),
      readinessScore: Math.floor(s.cgpa * 9),
      level: Math.floor(s.cgpa / 2),
      xp: Math.floor(s.cgpa * 50),
      onboardingComplete: true,
      isVerified: s.cgpa > 7.5,
    });
  }

  // ─── Drives ───────────────────────────────────────────────────────────────
  console.log('🏢 Creating placement drives...');
  const drivesData = [
    {
      companyName: 'TechCorp India',
      role: 'Software Development Engineer',
      domain: 'Software Development',
      package: '18-24 LPA',
      location: 'Bangalore',
      workMode: 'hybrid',
      minCgpa: 7.0,
      allowedBranches: ['Computer Engineering', 'Information Technology', 'Data Science & Algorithms'],
      maxBacklogs: 0,
      allowedYears: ['4th Year'],
      skills: ['Data Structures', 'Algorithms', 'JavaScript', 'React', 'Node.js'],
      description: 'TechCorp India is looking for passionate SDE candidates for their product engineering team. You will work on building scalable microservices and modern web applications.',
      rounds: [
        { name: 'Aptitude Test', type: 'aptitude', duration: '60 min', description: 'Quantitative, logical, and verbal reasoning' },
        { name: 'Technical Round 1 (DSA)', type: 'coding', duration: '90 min', description: 'Data structures and algorithms on HackerRank' },
        { name: 'Technical Round 2', type: 'technical', duration: '60 min', description: 'System design and project discussion' },
        { name: 'HR Round', type: 'hr', duration: '30 min', description: 'Culture fit, CTC negotiation' },
      ],
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      driveDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      venue: 'KJSCE Seminar Hall, Block A',
    },
    {
      companyName: 'DataVision Analytics',
      role: 'Data Science Analyst',
      domain: 'Data Science',
      package: '14-18 LPA',
      location: 'Mumbai',
      workMode: 'hybrid',
      minCgpa: 7.5,
      allowedBranches: ['Data Science & Algorithms', 'Computer Engineering', 'Information Technology'],
      maxBacklogs: 0,
      allowedYears: ['4th Year'],
      skills: ['Python', 'Machine Learning', 'SQL', 'Tableau', 'Statistics'],
      description: 'Join our growing data science team and work on real-world analytics problems for Fortune 500 clients. Experience with ML frameworks and visualization tools preferred.',
      rounds: [
        { name: 'Online Assessment', type: 'aptitude', duration: '90 min', description: 'Python MCQs + SQL + case study' },
        { name: 'Case Study Presentation', type: 'technical', duration: '45 min', description: 'Analyze a dataset and present insights' },
        { name: 'Technical Interview', type: 'technical', duration: '60 min', description: 'ML concepts, statistics, hands-on coding' },
        { name: 'HR Discussion', type: 'hr', duration: '20 min' },
      ],
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      driveDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      venue: 'Virtual (Zoom)',
    },
    {
      companyName: 'CloudSolutions Pvt Ltd',
      role: 'Cloud Infrastructure Engineer',
      domain: 'DevOps',
      package: '12-16 LPA',
      location: 'Pune',
      workMode: 'on-site',
      minCgpa: 6.5,
      allowedBranches: ['Computer Engineering', 'Information Technology', 'Electronics & Telecommunication'],
      maxBacklogs: 1,
      allowedYears: ['4th Year'],
      skills: ['AWS', 'Docker', 'Kubernetes', 'Linux', 'Python', 'Git'],
      description: 'CloudSolutions is expanding its DevOps team. Work with cutting-edge cloud infrastructure and automation tools.',
      rounds: [
        { name: 'Technical MCQ Test', type: 'aptitude', duration: '60 min' },
        { name: 'Linux & Cloud Practical', type: 'coding', duration: '120 min' },
        { name: 'Technical Interview', type: 'technical', duration: '60 min' },
        { name: 'Managerial Round', type: 'hr', duration: '30 min' },
      ],
      deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
      venue: 'KJSCE Placement Cell',
    },
    {
      companyName: 'FinTech Innovations',
      role: 'Full Stack Developer',
      domain: 'Software Development',
      package: '20-28 LPA',
      location: 'Bangalore / Remote',
      workMode: 'remote',
      minCgpa: 7.5,
      allowedBranches: ['Computer Engineering', 'Information Technology'],
      maxBacklogs: 0,
      allowedYears: ['4th Year'],
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'System Design'],
      description: 'Build the future of digital banking. FinTech Innovations is looking for senior-level full stack engineers to join their product team.',
      rounds: [
        { name: 'Coding Assessment', type: 'coding', duration: '120 min', description: '2 DSA problems + 1 system design question' },
        { name: 'Technical Round 1', type: 'technical', duration: '90 min' },
        { name: 'Technical Round 2 (Architecture)', type: 'technical', duration: '60 min' },
        { name: 'Culture Fit', type: 'hr', duration: '30 min' },
      ],
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      driveDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    },
    {
      companyName: 'CyberSec Guardians',
      role: 'Security Analyst (Internship + PPO)',
      domain: 'Software Development',
      package: '6-8 LPA (Internship)',
      location: 'Mumbai',
      workMode: 'hybrid',
      jobType: 'internship',
      minCgpa: 7.0,
      allowedBranches: ['Computer Engineering', 'Information Technology', 'Electronics & Telecommunication'],
      maxBacklogs: 1,
      allowedYears: ['3rd Year', '4th Year'],
      skills: ['Networking', 'Linux', 'Python', 'Security Fundamentals', 'OWASP'],
      description: 'A 6-month internship with Pre-Placement Offer opportunity. Work on real-world security audits, penetration testing, and vulnerability assessments.',
      rounds: [
        { name: 'Aptitude + Technical MCQs', type: 'aptitude', duration: '45 min' },
        { name: 'Technical Interview', type: 'technical', duration: '45 min' },
        { name: 'HR Round', type: 'hr', duration: '20 min' },
      ],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const d of drivesData) {
    await Drive.create({
      ...d,
      jobType: (d as any).jobType || 'full-time',
      approvalStatus: 'published',
      interestCount: Math.floor(Math.random() * 50 + 10),
      applicationCount: Math.floor(Math.random() * 20 + 5),
      createdBy: adminUser._id,
    });
  }

  // ─── Practice Questions ───────────────────────────────────────────────────
  console.log('📝 Creating practice questions...');
  const questionsData = [
    {
      title: 'Two Sum',
      description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.',
      type: 'coding',
      difficulty: 'easy',
      tags: ['arrays', 'hash-map', 'seed'],
      starterCode: `function twoSum(nums, target) {\n  // Your solution here\n}`,
      solutionCode: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n}`,
      testCases: [
        { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', isHidden: false },
        { input: '[3,2,4]\n6', expectedOutput: '[1,2]', isHidden: false },
        { input: '[3,3]\n6', expectedOutput: '[0,1]', isHidden: true },
      ],
      languagesAllowed: ['javascript', 'python', 'java', 'cpp'],
      hint: 'Use a HashMap to store complement values as you iterate.',
      explanation: 'Use a hash map to store each number and its index. For each number, check if its complement (target - num) is already in the map.',
    },
    {
      title: 'What is the output?',
      description: 'What will be the output of the following JavaScript code?\n```javascript\nconsole.log(typeof null);\n```',
      type: 'mcq',
      difficulty: 'easy',
      tags: ['javascript', 'fundamentals', 'seed'],
      options: [
        { label: 'A', text: '"null"' },
        { label: 'B', text: '"object"' },
        { label: 'C', text: '"undefined"' },
        { label: 'D', text: '"string"' },
      ],
      correctAnswer: 'B',
      explanation: 'This is a well-known JavaScript quirk. `typeof null` returns "object" due to a legacy bug in the language specification that was never fixed for backward compatibility.',
      hint: 'This is a famous JavaScript quirk.',
    },
    {
      title: 'Reverse a Linked List',
      description: 'Given the head of a singly linked list, reverse the list and return the reversed list.',
      type: 'coding',
      difficulty: 'easy',
      tags: ['linked-list', 'seed'],
      starterCode: `function reverseList(head) {\n  // Your solution\n}`,
      testCases: [
        { input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]', isHidden: false },
        { input: '[1,2]', expectedOutput: '[2,1]', isHidden: false },
      ],
      hint: 'Use three pointers: prev, curr, next.',
    },
    {
      title: 'Time Complexity of Binary Search',
      description: 'What is the worst-case time complexity of Binary Search on a sorted array of n elements?',
      type: 'mcq',
      difficulty: 'easy',
      tags: ['algorithms', 'complexity', 'seed'],
      options: [
        { label: 'A', text: 'O(n)' },
        { label: 'B', text: 'O(n log n)' },
        { label: 'C', text: 'O(log n)' },
        { label: 'D', text: 'O(1)' },
      ],
      correctAnswer: 'C',
      explanation: 'Binary search divides the search space in half with each comparison, giving a worst-case of O(log n).',
    },
    {
      title: 'Maximum Subarray (Kadane\'s Algorithm)',
      description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
      type: 'coding',
      difficulty: 'medium',
      tags: ['arrays', 'dp', 'seed'],
      starterCode: `function maxSubArray(nums) {\n  // Implement Kadane's algorithm\n}`,
      testCases: [
        { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', isHidden: false },
        { input: '[1]', expectedOutput: '1', isHidden: false },
        { input: '[5,4,-1,7,8]', expectedOutput: '23', isHidden: true },
      ],
      hint: 'At each position, decide: extend the current subarray or start fresh.',
    },
    {
      title: 'SQL — Find Duplicate Emails',
      description: 'Write an SQL query to find all duplicate emails in a table called `Person` with columns `id` and `email`.',
      type: 'mcq',
      difficulty: 'easy',
      tags: ['sql', 'database', 'seed'],
      options: [
        { label: 'A', text: 'SELECT email FROM Person WHERE COUNT(email) > 1' },
        { label: 'B', text: 'SELECT email FROM Person GROUP BY email HAVING COUNT(email) > 1' },
        { label: 'C', text: 'SELECT DISTINCT email FROM Person' },
        { label: 'D', text: 'SELECT email FROM Person HAVING COUNT(*) > 1' },
      ],
      correctAnswer: 'B',
      explanation: 'GROUP BY groups rows with same email, HAVING filters groups with count > 1 (duplicates).',
    },
    {
      title: 'What does REST stand for?',
      description: 'In the context of web APIs, what does REST stand for?',
      type: 'mcq',
      difficulty: 'easy',
      tags: ['web', 'fundamentals', 'seed'],
      options: [
        { label: 'A', text: 'Representational State Transfer' },
        { label: 'B', text: 'Remote Execution State Transaction' },
        { label: 'C', text: 'Resource Encoding and State Transfer' },
        { label: 'D', text: 'Responsive Extended State Transfer' },
      ],
      correctAnswer: 'A',
      explanation: 'REST (Representational State Transfer) is an architectural style for designing networked applications, using HTTP requests to perform CRUD operations.',
    },
    {
      title: 'Valid Parentheses',
      description: 'Given a string s containing just "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
      type: 'coding',
      difficulty: 'easy',
      tags: ['stack', 'strings', 'seed'],
      starterCode: `function isValid(s) {\n  // Use a stack\n}`,
      testCases: [
        { input: '"()"', expectedOutput: 'true', isHidden: false },
        { input: '"()[]{}"', expectedOutput: 'true', isHidden: false },
        { input: '"(]"', expectedOutput: 'false', isHidden: false },
        { input: '"([)]"', expectedOutput: 'false', isHidden: true },
      ],
      hint: 'Use a stack. Push opening brackets, pop and check for closing.',
    },
    {
      title: 'Aptitude: Train Speed',
      description: 'A train 150m long passes a pole in 15 seconds. What is the speed of the train in km/h?',
      type: 'aptitude',
      difficulty: 'easy',
      tags: ['aptitude', 'time-speed-distance', 'seed'],
      options: [
        { label: 'A', text: '36 km/h' },
        { label: 'B', text: '45 km/h' },
        { label: 'C', text: '54 km/h' },
        { label: 'D', text: '60 km/h' },
      ],
      correctAnswer: 'A',
      explanation: 'Speed = Distance/Time = 150/15 = 10 m/s = 10 × 18/5 = 36 km/h',
    },
    {
      title: 'Merge Two Sorted Lists',
      description: 'Merge two sorted linked lists and return it as a sorted list.',
      type: 'coding',
      difficulty: 'easy',
      tags: ['linked-list', 'recursion', 'seed'],
      starterCode: `function mergeTwoLists(l1, l2) {\n  // Merge two sorted lists\n}`,
      testCases: [
        { input: '[1,2,4]\n[1,3,4]', expectedOutput: '[1,1,2,3,4,4]', isHidden: false },
        { input: '[]\n[]', expectedOutput: '[]', isHidden: false },
      ],
    },
  ];

  for (const q of questionsData) {
    await Question.create({
      ...q,
      visibility: 'public',
      approvalStatus: 'approved',
      createdBy: adminUser._id,
      totalAttempts: Math.floor(Math.random() * 200),
      correctRate: Math.floor(Math.random() * 40 + 40),
    });
  }

  // ─── Learning Paths ───────────────────────────────────────────────────────
  console.log('📚 Creating learning paths...');
  // (Lessons created inline for brevity)
  const webDevPath = await LearningPath.create({
    title: 'Full Stack Web Development',
    description: 'Master the MERN stack and build production-ready web applications from scratch.',
    targetRole: 'Software Development Engineer',
    domain: 'Software Development',
    estimatedHours: 40,
    difficulty: 'intermediate',
    tags: ['javascript', 'react', 'node', 'mongodb', 'mern', 'seed'],
    modules: [],
    prerequisites: ['Basic HTML/CSS', 'JavaScript fundamentals'],
    learningOutcomes: [
      'Build RESTful APIs with Node.js/Express',
      'Create dynamic UIs with React',
      'Design MongoDB schemas',
      'Deploy to cloud platforms',
    ],
    isPublished: true,
    enrollmentCount: 234,
    rating: 4.7,
    createdBy: adminUser._id,
  });

  const dsPath = await LearningPath.create({
    title: 'Data Structures & Algorithms Mastery',
    description: 'Comprehensive DSA preparation covering all major topics for technical interviews at top companies.',
    targetRole: 'Software Development Engineer',
    domain: 'Software Development',
    estimatedHours: 60,
    difficulty: 'intermediate',
    tags: ['dsa', 'algorithms', 'interviews', 'competitive-programming', 'seed'],
    modules: [],
    prerequisites: ['Any programming language basics'],
    learningOutcomes: [
      'Master arrays, linked lists, trees, graphs',
      'Implement dynamic programming solutions',
      'Analyze time and space complexity',
      'Solve problems on LeetCode/HackerRank',
    ],
    isPublished: true,
    enrollmentCount: 412,
    rating: 4.9,
    createdBy: adminUser._id,
  });

  await LearningPath.create({
    title: 'Machine Learning Foundations',
    description: 'From Python basics to building and deploying ML models. Perfect for data science roles.',
    targetRole: 'Data Science Analyst',
    domain: 'Data Science',
    estimatedHours: 45,
    difficulty: 'intermediate',
    tags: ['python', 'machine-learning', 'scikit-learn', 'tensorflow', 'seed'],
    modules: [],
    isPublished: true,
    enrollmentCount: 189,
    rating: 4.6,
    createdBy: adminUser._id,
  });

  console.log('\n✅ Seed complete!');
  console.log('─'.repeat(50));
  console.log('👤 Admin:    admin@recruitxchange.edu / Admin@1234');
  console.log('🎓 Students: priya.seeduser@kjsce.edu / Student@1234');
  console.log('             rahul.seeduser@kjsce.edu / Student@1234');
  console.log('─'.repeat(50));

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
