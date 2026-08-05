import { IStudentProfile } from '../models/StudentProfile';

// ─── Predictor Weight Configuration ──────────────────────────────────────────
const WEIGHTS = {
  cgpa: 0.25,          // Academic performance
  atsScore: 0.20,      // Resume quality
  skills: 0.20,        // Breadth of skills
  socialLinks: 0.10,   // Online presence
  practiceAttempts: 0.15, // Practice performance
  profileComplete: 0.10,  // Profile completeness
};

// ─── Skill Tiers for Scoring ──────────────────────────────────────────────────
const SKILL_TIER_SCORES: Record<string, number> = {
  // High-demand skills score more
  'javascript': 95, 'typescript': 95, 'react': 90, 'node.js': 90,
  'python': 92, 'java': 88, 'go': 85, 'rust': 80,
  'sql': 85, 'mongodb': 80, 'postgresql': 82,
  'aws': 88, 'docker': 85, 'kubernetes': 82,
  'machine learning': 90, 'deep learning': 88, 'tensorflow': 85,
  'data structures': 95, 'algorithms': 95, 'system design': 90,
  'git': 75, 'linux': 78,
  'html': 60, 'css': 60,
};

// ─── Score Component Calculations ─────────────────────────────────────────────
const scoreCgpa = (cgpa: number): number => {
  // 9-10: 100, 8-9: 85, 7-8: 70, 6-7: 55, below 6: 40
  if (cgpa >= 9) return 100;
  if (cgpa >= 8) return 85;
  if (cgpa >= 7) return 70;
  if (cgpa >= 6) return 55;
  return 40;
};

const scoreSkills = (skills: string[]): number => {
  if (!skills || skills.length === 0) return 0;
  const scored = skills.map(s => SKILL_TIER_SCORES[s.toLowerCase()] || 50);
  const avg = scored.reduce((a, b) => a + b, 0) / scored.length;
  // Bonus for having more than 5 skills (up to 10)
  const breadthBonus = Math.min(15, (skills.length - 1) * 1.5);
  return Math.min(100, avg + breadthBonus);
};

const scoreProfileComplete = (profile: IStudentProfile): number => {
  let score = 0;
  if (profile.phone) score += 10;
  if (profile.rollNumber) score += 10;
  if (profile.college) score += 10;
  if (profile.department) score += 10;
  if (profile.cgpa) score += 10;
  if (profile.skills && profile.skills.length > 0) score += 15;
  if (profile.resumeUrl) score += 25;
  if (profile.socialLinks?.linkedin) score += 5;
  if (profile.socialLinks?.github) score += 5;
  return score; // already 0-100
};

const scoreSocialLinks = (profile: IStudentProfile): number => {
  let score = 0;
  const links = profile.socialLinks || {};
  if (links.linkedin) score += 35;
  if (links.github) score += 35;
  if (links.portfolio) score += 15;
  if (links.leetcode) score += 10;
  if (links.hackerrank || links.codechef) score += 5;
  return score;
};

// ─── Identify Weak Areas ──────────────────────────────────────────────────────
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

// ─── Main Predictor Function ──────────────────────────────────────────────────
export const runPredictor = (
  profile: IStudentProfile,
  attemptSuccessRate = 0
): PredictorResult => {
  const breakdown = {
    cgpa: scoreCgpa(profile.cgpa),
    atsScore: profile.atsScore ?? 50,
    skills: scoreSkills(profile.skills),
    socialLinks: scoreSocialLinks(profile),
    profileComplete: scoreProfileComplete(profile),
    practiceAttempts: Math.min(100, attemptSuccessRate),
  };

  const readinessScore = Math.round(
    breakdown.cgpa * WEIGHTS.cgpa +
    breakdown.atsScore * WEIGHTS.atsScore +
    breakdown.skills * WEIGHTS.skills +
    breakdown.socialLinks * WEIGHTS.socialLinks +
    breakdown.practiceAttempts * WEIGHTS.practiceAttempts +
    breakdown.profileComplete * WEIGHTS.profileComplete
  );

  // Confidence is based on how complete the profile data is
  const dataPoints = [
    profile.cgpa > 0,
    !!profile.atsScore,
    profile.skills.length > 0,
    !!profile.socialLinks,
    attemptSuccessRate > 0,
  ].filter(Boolean).length;
  const confidence = Math.round((dataPoints / 5) * 100);

  // Identify weak topics
  const weakTopics: WeakTopic[] = [];

  if (breakdown.cgpa < 60) {
    weakTopics.push({
      topic: 'CGPA / Academics',
      currentScore: breakdown.cgpa,
      targetScore: 70,
      priority: 'high',
      suggestion: 'Focus on improving academic performance to meet drive eligibility thresholds.',
    });
  }
  if (breakdown.atsScore < 60) {
    weakTopics.push({
      topic: 'Resume / ATS Score',
      currentScore: breakdown.atsScore,
      targetScore: 75,
      priority: 'high',
      suggestion: 'Enhance your resume with industry keywords. Use the Resume Builder and ATS checker.',
    });
  }
  if (breakdown.skills < 65) {
    weakTopics.push({
      topic: 'Technical Skills',
      currentScore: breakdown.skills,
      targetScore: 80,
      priority: 'high',
      suggestion: 'Add in-demand skills like Data Structures, React, or Python through the Learning Hub.',
    });
  }
  if (breakdown.socialLinks < 50) {
    weakTopics.push({
      topic: 'Online Presence',
      currentScore: breakdown.socialLinks,
      targetScore: 70,
      priority: 'medium',
      suggestion: 'Complete your LinkedIn and GitHub profiles to showcase your work to recruiters.',
    });
  }
  if (breakdown.practiceAttempts < 50) {
    weakTopics.push({
      topic: 'Practice Performance',
      currentScore: breakdown.practiceAttempts,
      targetScore: 70,
      priority: 'medium',
      suggestion: 'Attempt more practice questions in the Practice Hub to boost your aptitude score.',
    });
  }

  // Top strengths (scores above 75)
  const strengthMap: Record<string, number> = {
    'CGPA': breakdown.cgpa,
    'Resume Quality': breakdown.atsScore,
    'Technical Skills': breakdown.skills,
    'Online Presence': breakdown.socialLinks,
    'Practice Score': breakdown.practiceAttempts,
  };
  const topStrengths = Object.entries(strengthMap)
    .filter(([, v]) => v >= 75)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([k]) => k);

  // General recommendations
  const recommendations: string[] = [
    readinessScore < 50 ? 'Start with the Beginner learning paths in the Learning Hub.' : null,
    profile.skills.length < 5 ? 'Add at least 5-8 technical skills to your profile.' : null,
    !profile.resumeUrl ? 'Upload your resume to get ATS analysis.' : null,
    !profile.socialLinks?.linkedin ? 'Create a LinkedIn profile and add it to your profile.' : null,
    readinessScore >= 75 ? 'You are placement-ready! Explore open drives in Drive Discovery.' : null,
  ].filter((r): r is string => r !== null);

  return {
    readinessScore: Math.min(100, Math.max(0, readinessScore)),
    confidence,
    breakdown: {
      cgpa: breakdown.cgpa,
      atsScore: breakdown.atsScore,
      skills: breakdown.skills,
      socialLinks: breakdown.socialLinks,
      profileComplete: breakdown.profileComplete,
    },
    weakTopics,
    topStrengths,
    recommendations,
  };
};
